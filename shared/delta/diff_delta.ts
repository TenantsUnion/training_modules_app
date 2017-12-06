import * as _ from 'underscore';
import {DeltaObj, DeltaArrDiff} from './delta';
import {isDeltaObj, isDeltaStatic, isKeyArr} from './typeguards_delta';

export const diffDeltaObj = (before: DeltaObj, after: DeltaObj): DeltaObj => {
    return Object.keys(after).reduce((acc, key) => {
        let afterVal = after[key];
        let beforeVal = before[key];

        let propertyAdded = !beforeVal && afterVal;
        let propertyDeleted = beforeVal && !afterVal;
        if (propertyAdded) {
            acc[key] = afterVal;
        } else if (propertyDeleted) {
            if (_.isArray(beforeVal)) {
                acc[key] = []
            } else if (isDeltaObj(beforeVal)) {
                // empty object {} doesn't match DeltaStatic or DeltaObj properties
                // property set to null will indicate that the value changed
                // and should be overwritten by the server to the database
                acc[key] = null;
            } else if (isDeltaStatic(beforeVal)) {
                acc[key] = new Delta().diff(beforeVal);
            }
        } else if (isKeyArr(beforeVal) && isKeyArr(afterVal)) {
            acc[key] = deltaArrayDiff(beforeVal, afterVal);
        } else if (isDeltaObj(beforeVal) && isDeltaObj(afterVal)) {
            acc[key] = diffDeltaObj(beforeVal, afterVal);
        } else if (isDeltaStatic(beforeVal) && isDeltaStatic(afterVal)) {
            let diff = beforeVal.diff(afterVal);
            if (diff.ops.length) {
                acc[key] = diff;
            }
        } else if (beforeVal !== afterVal) {
            acc[key] = afterVal;
        }
        return acc;
    }, {});
};


export interface DeltaArrayOp {
    val: any,
    op: 'ADD' | 'DELETE' | 'MOVE',
    index: number,
    beforeIndex?: number
}

/**
 * Array of string or number elements where ever element is unique (not enforced through type)
 */
type KeyArray = (number | string)[]

/**
 * Expects each Delta Object array to hash to a unique key when called with the key function.
 *
 * @param {delta.DeltaObjArr} beforeArr
 * @param {delta.DeltaObjArr} afterArr
 * @param {(delta: DeltaObj) => string} keyFn
 * @returns {delta.DeltaArrDiff}
 */
export const deltaArrayDiff = (beforeArr: (string | number)[], afterArr: (string | number)[]): DeltaArrDiff => {
    // cases -- no change, elements moved (how to identify unique elements?), elements deleted, elements added,
    // think of as array of ids -- title and description is part of the view/ changes handled differently
    // each element is unique
    let beforeMap = toIndexMap(beforeArr);
    let afterMap = toIndexMap(afterArr);

    let changeOps: DeltaArrayOp[] = [];
    // ops applied is the state of the current ops that are needed to transform the before array into the new one
    // applied on a copy of the before array
    let opsApplied = applyOps(beforeArr, changeOps);

    // deletions, then additions, then check what has moved instead of being shifted from elements being added/removed

    // deletions
    changeOps = Object.keys(beforeMap).reduce((acc, key, index) => {
        let intermediateMap = toIndexMap(opsApplied);
        if (!_.isNumber(afterMap[key]) && _.isNumber(intermediateMap[key])) {
            let op: DeltaArrayOp = {
                val: key,
                op: 'DELETE',
                index: intermediateMap[key]
            };
            acc.push(op);
            opsApplied = applyOps(opsApplied, [op]);
        }
        return acc;
    }, changeOps);

    // additions -- iterate through after arr to have insertions op indexes be updated in correct order
    changeOps = afterArr.reduce((acc, key, index) => {
        if (_.isNumber(key) && !_.isNumber(beforeMap[key])) {
            acc.push({
                val: key,
                op: 'ADD',
                index: index
            });
        }
        return acc;
    }, changeOps);


    // apply current insert/delete change operations
    opsApplied = applyOps(beforeArr, changeOps);

    // loop through after array and when the key differs from the opsApplied array create/ push a move operation
    // then update the opsApplied array to determine the next operation from the most recent version of the array
    afterArr.reduce((accOps, key, index) => {
        let currentIndex = toIndexMap(opsApplied)[key];
        if (currentIndex !== index) {
            accOps.push({
                beforeIndex: currentIndex,
                index: index,
                val: key,
                op: 'MOVE'
            });

            opsApplied = applyOps(opsApplied, accOps);
        }
        return accOps;
    }, changeOps);


    return changeOps;
};

const toIndexMap = (keyArray: (string | number)[]) => {
    return keyArray.reduce((acc, el, index) => {
        acc[el] = index;
        return acc;
    }, {});
};

/**
 * Applies the provided array of {@link DeltaArrayOp} operations in order to the provided key area and returns the result
 *
 * @param {KeyArray} keyArray
 * @param {DeltaArrayOp[]} ops
 */
const applyOps = (keyArray: KeyArray, ops: DeltaArrayOp[]): KeyArray => {
    return ops.reduce((intermediateArr: KeyArray, op: DeltaArrayOp) => {
        switch (op.op) {
            case 'ADD':
                intermediateArr.splice(op.index, 0, op.val);
                break;
            case 'MOVE':
                let moveEl = intermediateArr.splice(op.beforeIndex, 1);
                intermediateArr.splice(op.index, 0, moveEl[0]);
                break;
            case 'DELETE':
                intermediateArr.splice(op.index, 1);
                break;
            default:
                throw new Error(`${op.op} is not a valid DeltaArrayOp. Must be either 'ADD', 'MOVE', 'DELETE'`);
        }
        return intermediateArr;
    }, _.extend([], keyArray));
};