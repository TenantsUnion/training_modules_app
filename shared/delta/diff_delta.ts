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
            acc[key] = handleDiffDeltaObjArray(beforeVal, afterVal);
        } else if (isDeltaObj(beforeVal) && isDeltaObj(afterVal)) {
            acc[key] = diffDeltaObj(beforeVal, afterVal);
        } else if (isDeltaStatic(beforeVal) && isDeltaStatic(afterVal)) {
            let diff = beforeVal.diff(afterVal);
            if (diff.ops.length) {
                acc[key] = diff;
            }
        } else if (beforeVal !== afterVal){
            acc[key] = afterVal;
        }
        return acc;
    }, {});
};

/**
 * Expects each Delta Object array to hash to a unique key when called with the key function.
 *
 * @param {delta.DeltaObjArr} beforeArr
 * @param {delta.DeltaObjArr} afterArr
 * @param {(delta: DeltaObj) => string} keyFn
 * @returns {delta.DeltaArrDiff}
 */
export const handleDiffDeltaObjArray = (beforeArr: string[], afterArr: string[]): DeltaArrDiff => {
    // cases -- no change, elements moved (how to identify unique elements?), elements deleted, elements added,
    // think of as array of ids -- title and description is part of the view/ changes handled differently
    // each element is unique

    let beforeIndex = beforeArr.reduce((acc, el, index) => {
        acc[el] = index;
        return acc;
    }, {});

    let afterIndex = afterArr.reduce((acc, el, index) => {
        acc[el] = index;
        return acc;
    }, {});

    let changes = beforeArr.reduce((acc, el) => {
        if (beforeIndex[el] && !_.isNumber(afterIndex[el])) {
            acc[el] = {
                beforeIndex: beforeIndex[el],
                change: 'DELETED'
            };
        } else if (beforeIndex[el] !== afterIndex[el]) {
            acc[el] = {
                beforeIndex: beforeIndex[el],
                index: afterIndex[el],
                change: 'MOVED'
            };
        } else {
            // no change
        }
        return acc;
    }, <DeltaArrDiff> {});

    let addedChanges = afterArr.reduce((acc, el) => {
        if (!_.isNumber(beforeIndex[el]) && afterIndex[el]) {
            acc[el] = {
                index: afterIndex[el],
                change: 'ADDED'
            };
        }
        return acc;
    }, {});

    // check if element was added by checking for elements in afterArr that aren't in before
    return _.extend(changes, addedChanges);
    // element mutated: handle by sending delta object of element specific to (document level) i.e course, module, section
};
