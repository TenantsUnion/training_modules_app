import * as _ from 'underscore';
import {DeltaObj} from './delta';

/**
 * Type guard for {@link Quill.DeltaStatic}. Only checks that parameter is type object and has
 * {@link Quill.DeltaStatic#ops} array property and <b>not</b> functions of Quill's Delta library
 */
export const isDeltaStatic = (obj: any): obj is Quill.DeltaStatic => {
    return _.isObject(obj) && !_.isArray(obj) && _.isArray(obj.ops);
};

/**
 * Type guard for {@link DeltaObj}
 */
export const isDeltaObj = (obj: any): obj is DeltaObj => {
    if (!_.isObject(obj) || _.isArray(obj)) {
        return false;
    }

    return Object.keys(obj).map((key) => obj[key])
        .every((val) => {
            return _.isString(val) || _.isNumber(val) || _.isBoolean(val) ||
                isDeltaStatic(val) || isKeyArr(val) || isDeltaStaticArray(val);
        });
};

/**
 * Helper function for type guard {@link isDeltaObj} to be able to recursively handle nested array properties
 * for {@link DeltaObj} structures
 * @param {any[]} arr
 * @returns {boolean}
 */
export const isDeltaStaticArray = (arr: any): arr is Quill.DeltaStatic[] => {
    return _.isArray(arr) && arr.every((el) => isDeltaStatic(el));
};

/**
 * Type guard for an array of strings where each element is unique
 */
export const isKeyArr = (arr: any): arr is string[] => {
    let isStringArr = _.isArray(arr) && arr.every((el) => _.isString(el));

    if(!isStringArr) {
        return false;
    }
    // check to make sure each element is unique
    let keyOccurrences = arr.reduce((acc, el) => {
        if (_.has(acc, el)) {
            // key is not unique
            acc[el] = false;
        } else {
            acc[el] = true;
        }
        return acc;
    }, {});

    return Object.keys(keyOccurrences)
        .map((key) => keyOccurrences[key])
        .every((occursOnce) => occursOnce);
};

