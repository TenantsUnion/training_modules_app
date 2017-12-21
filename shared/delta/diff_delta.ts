import * as _ from 'underscore';
import * as Delta from 'quill-delta';
import {DeltaObj, DeltaObjDiff, QuillContentObj} from './delta';
import {isDeltaObj, isDeltaStatic, isKeyArr} from './typeguards_delta';
import {deltaArrayDiff} from './diff_key_array';

export const diffPropsDeltaObj = (props: string[], before: DeltaObj, after: DeltaObj): DeltaObjDiff => {
    return diffDeltaObj(_.pick(before, props), _.pick(after, props));
};

export const diffDeltaObj = (before: DeltaObj, after: DeltaObj): DeltaObjDiff => {
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
                // todo I think this is wrong if the property is deleted...
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


export const diffQuillContentObj = (before: QuillContentObj, after: QuillContentObj): QuillContentObj => {
    return Object.keys(after).reduce((acc, key) => {
        acc[key] = before[key] ? new Delta(before[key].ops).diff(after[key]) : after[key];
        return acc;
    }, {});
};



