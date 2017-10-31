import * as quillDelta from "quill-delta";
import * as _ from "underscore";

//use types from @types/Quill for standalone quill-delta library that doesn't require DOM
let Delta: Quill.DeltaStatic = quillDelta;

export type DeltaObj = {
    [index: string]: Quill.DeltaStatic | (Quill.DeltaStatic | DeltaObj)[] | DeltaObj
        | string | number | { [index: string]: string | number }
};

export const parameterErrorMsg = 'Can only convert objects. Was given parameter: ';
export const convertToDeltaObj = (obj: {} | {}[], filterPredicate?): DeltaObj | (DeltaObj | DeltaObj[])[] => {
    if (!_.isObject(obj) || _.isArray(obj)) {
        throw `${parameterErrorMsg}${obj}`;
    }

    return Object.keys(obj).reduce((acc, key) => {
        if (!_.isFunction(filterPredicate) || filterPredicate(key)) {
            acc[key] = convertDeltaProperty(obj[key]);
        } else {
            // value is not converted
            acc[key] = obj[key];
        }
        return acc;
    }, {});
};

//primitive type or []
const convertDeltaProperty = (val): Quill.DeltaStatic => {
    if (_.isArray(val)) {
        // flattens array into single Delta object with flattened array elements as inserts
        return val.reduce((acc: Quill.DeltaStatic, el) => {
            return acc.concat(convertDeltaProperty(el));
        }, new Delta());
    }

    if (_.isObject(val)) {
        throw `Cannot convert objects to Deltas. val was ${val}`;
    }

    return new Delta().insert(val);
};

