import * as _ from 'underscore';
import {DeltaObj} from './delta';
import {isDeltaObj, isDeltaStatic, isKeyArr} from './typeguards_delta';
import {deltaArrayDiff} from './diff_key_array';

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



