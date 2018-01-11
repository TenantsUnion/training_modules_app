import * as _ from 'underscore';

/**
 * Replaces properties and values (at nested levels) that correspond to a key in the provided placeholderIdMap with
 * placeholderIdMap value.
 * Handles nested objects and arrays by recursively calling itself or {@link updateArrPlaceholderIds}
 *
 * @param  obj
 * @param placeholderIdMap
 * @returns {} obj with the all the values that are keys in the placeholderIdMap substituted
 */
export const updateObjPlaceholderIds = (obj: {}, placeholderIdMap: { [p: string]: string }): {} => {
    let updatedObject = Object.keys(obj).reduce((acc, key) => {
        let val = obj[key];
        let updatedVal = _.isString(val) && placeholderIdMap[val] ? placeholderIdMap[val] :
            _.isArray(val) ? updateArrPlaceholderIds(val, placeholderIdMap) :
                _.isObject(val) ? updateObjPlaceholderIds(val, placeholderIdMap) : val;
        let updatedKey = placeholderIdMap[key] ? placeholderIdMap[key] : key;
        acc[updatedKey] = updatedVal;
        return acc;
    }, {});

    return updatedObject;
};

export const updateArrPlaceholderIds = (arr: any[], placeholderIdMap: { [p: string]: string }): any[] => {
    let updatedArr = arr.map((el) => {
        return _.isString(el) && placeholderIdMap[el] ? placeholderIdMap[el] :
            _.isArray(el) ? updateArrPlaceholderIds(el, placeholderIdMap) :
                _.isObject(el) ? updateObjPlaceholderIds(el, placeholderIdMap) : el;
    });
    return updatedArr;
};
