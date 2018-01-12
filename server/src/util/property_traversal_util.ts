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
                let camelCaseKey = action(key);
                acc[camelCaseKey] = recurseAction(obj[key]);
                return acc;
            }, {});
        } else {
            // primitive values
            return obj;
        }
    };
    return recurseAction;
};
