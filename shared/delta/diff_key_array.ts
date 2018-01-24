import * as _ from 'underscore';

export const addDeltaArrOp = (val: any, index: number): DeltaArrOp => {
    return {
        val, index,
        op: 'ADD',
    };
};

export interface DeltaArrOp {
    val?: any,
    op: 'ADD' | 'DELETE' | 'MOVE',
    index: number,
    beforeIndex?: number
}

export const isDeltaArrDiff = (arr: any): arr is DeltaArrOp[] => {
    return _.isArray(arr) && arr.every((obj) => isDeltaArrOp(obj));
};

export const isDeltaArrOp = (obj: any): obj is DeltaArrOp => {
    return _.isObject(obj) && !_.isArray(obj)
        && (obj.op === 'MOVE' || obj.op === 'ADD' || obj.op === 'DELETE')
        && (!obj.beforeIndex || _.isString(obj.beforeIndex) || _.isNumber(obj.beforeIndex))
        && (!obj.index || _.isString(obj.index) || _.isNumber(obj.index))
        && (obj.val || (_.isString(obj.index) || _.isNumber(obj.index)));
};

/**
 * Array of string or number elements where ever element is unique (not enforced through type)
 */
type KeyArray = string[]

export const deltaMapArrayDiff = <T> (before: T[], after: T[], mapFn: (diffObj: T[]) => KeyArray): DeltaArrOp[] => {
  return deltaArrayDiff(mapFn(before), mapFn(after));
};
/**
 * Expects each Delta Object array to hash to a unique key when called with the key function.
 *
 * @param {delta.DeltaObjArr} beforeArr
 * @param {delta.DeltaObjArr} afterArr
 * @param {(delta: DeltaObj) => string} keyFn
 * @returns {delta.DeltaArrDiff}
 */
export const deltaArrayDiff = (beforeArr: string[], afterArr: string[]): DeltaArrOp[] => {
    // cases -- no change, elements moved (how to identify unique elements?), elements deleted, elements added,
    // think of as array of ids -- title and description is part of the view/ changes handled differently
    // each element is unique
    let beforeMap = toIndexMap(beforeArr);
    let afterMap = toIndexMap(afterArr);

    let changeOps: DeltaArrOp[] = [];
    // ops applied is the state of the current ops that are needed to transform the before array into the new one
    // applied on a copy of the before array
    let opsApplied = applyDeltaArrOps(beforeArr, changeOps);

    // deletions, then additions, then check what has moved instead of being shifted from elements being added/removed

    // deletions
    changeOps = beforeArr.reduce((acc, key, index) => {
        let intermediateMap = toIndexMap(opsApplied);
        if (!_.isNumber(afterMap[key]) && _.isNumber(intermediateMap[key])) {
            let op: DeltaArrOp = {
                val: key,
                op: 'DELETE',
                index: intermediateMap[key]
            };
            acc.push(op);
            opsApplied = applyDeltaArrOps(opsApplied, [op]);
        }
        return acc;
    }, changeOps);

    // additions -- iterate through after arr to have insertions op indexes be updated in correct order
    changeOps = afterArr.reduce((acc, key, index) => {
        if ((_.isNumber(key) || _.isString(key)) && !_.isNumber(beforeMap[key])) {
            acc.push({
                val: key,
                op: 'ADD',
                index: index
            });
        }
        return acc;
    }, changeOps);


    // apply current insert/delete change operations
    opsApplied = applyDeltaArrOps(beforeArr, changeOps);

    // loop through after array and when the key differs from the opsApplied array create/ push a move operation
    // then update the opsApplied array to determine the next operation from the most recent version of the array
    afterArr.reduce((accOps, key, index) => {
        let currentIndex = toIndexMap(opsApplied)[key];
        if (currentIndex !== index) {
            let moveOp: DeltaArrOp = {
                beforeIndex: currentIndex,
                index: index,
                // val: key,
                op: 'MOVE'
            };
            accOps.push(moveOp);

            opsApplied = applyDeltaArrOps(opsApplied, [moveOp]);
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
 * Applies the provided array of {@link DeltaArrOp} operations in order to the provided key area and returns the result
 *
 * @param {KeyArray} keyArray
 * @param {DeltaArrOp[]} ops
 */
export const applyDeltaArrOps = (keyArray: KeyArray, ops: DeltaArrOp[]): KeyArray => {
    return ops.reduce((intermediateArr: KeyArray, op: DeltaArrOp) => {
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

/**
 * Updates each {@link DeltaArrOp#val} in the provided DeltaArrOps with the corresponding property value in the
 * provided valReplaceMap. If there is no corresponding key the original value is used.
 *
 * @param {DeltaArrOp[]} deltaArr
 * @param valReplaceMap
 * @returns {DeltaArrOp[]}
 */
export const updateArrOpsValues = (deltaArr: DeltaArrOp[], valReplaceMap: { [p: string]: string }): DeltaArrOp[] => {
    return deltaArr.map((quillArrOp: DeltaArrOp) => {
        let quillId = valReplaceMap[quillArrOp.val];
        return quillId ? _.extend({}, quillArrOp, {val: quillId}) : quillArrOp;
    });
};
