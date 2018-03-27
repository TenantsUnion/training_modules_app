import _ from "underscore";
import {DeltaObj} from "./delta";
import {isDeltaObj, isDeltaStatic} from './typeguards_delta';

//use types from @types/Quill for standalone quill-delta library that doesn't require DOM
export const parameterErrorMsg = 'Can only convert objects. Was given parameter: ';

/**
 * Converts an object into a DeltaObj by iterating through the provided object's properties and converting each value into
 * a {@link Quill.DeltaStatic} if a primitive value, a {@link DeltaObj} if an object, or an
 * {@type (Quill.DeltaStatic | DeltaObj[]} if an array.
 *
 * @param {} obj - object whose properties and values will be used to construct a corresponding DeltaObj
 * @param filterPredicate - optionally used to filter out keys on the provided obj if the key returns false when called
 */
export const convertToDeltaObj = (obj: {}, filterPredicate?: (key: string) => boolean): DeltaObj => {
    if (!_.isObject(obj) || _.isArray(obj)) {
        throw new Error(`${parameterErrorMsg}${obj}`);
    }

    return Object.keys(obj).reduce((acc, key) => {
        if (!_.isFunction(filterPredicate) || filterPredicate(key)) {
            let val = obj[key];
            if (_.isArray(val)) {
                acc[key] = val;
            } else if (_.isObject(val)) {
                acc[key] = convertToDeltaObj(val);
            } else {
                acc[key] = val;
            }
        }
        return acc;
    }, {});
};

export const convertToDeltaObjArray = (arr: any[]) => {
    return arr.map((el) => {
        if (isDeltaStatic(el) || isDeltaObj(el)) {
            return el;
        } else if (_.isArray(el)) {
            return convertToDeltaObjArray(el);
        } else if (_.isObject(el)) {
            return convertToDeltaObj(el);
        } else {
            return el;
        }
    });
};

//primitive type or []
export const filterEntityProperties = (key) => {
    return key !== 'version' && key !== 'id';
};

export const DEFAULT_DIFF_KEY_FN = (obj: any): string => {
    return obj.id;
};


export const convertEntityToDeltaObj = (entity) => {
    return convertToDeltaObj(entity, filterEntityProperties);
};


