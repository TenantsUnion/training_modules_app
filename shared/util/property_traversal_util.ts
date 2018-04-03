/**
 * Returns a curried function that takes an object and iterates over all properties drilling down into nested arrays
 * and objects to perform the provided action to transform each property and returns an object with the transformed properties
 * but the same corresponding values
 * @param {(par: any) => any} action
 * @returns {(obj) => (Date | Function | (Date | Function | any | {})[] | {} | any)}
 */
export const traverseActionOnProperties = (action: (par: any) => any) => {
    let recurseAction =  (obj) => {
        if (obj instanceof Date || obj instanceof Function) {
            return obj;
        } else if (obj instanceof Array) {
            return obj.map((el) => {
                return recurseAction(el);
            });
        } else if (obj instanceof Object) {
            return Object.keys(obj).reduce((acc, key) => {
                let property = action(key);
                acc[property] = recurseAction(obj[key]);
                return acc;
            }, {});
        } else {
            // primitive values
            return obj;
        }
    };
    return recurseAction;
};
