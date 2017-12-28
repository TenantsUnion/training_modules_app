import * as _ from "underscore";
import {DeltaDiff, DeltaObjDiff} from './delta';
import {isDeltaStatic, isKeyArr} from './typeguards_delta';
import {applyDeltaArrOps, isDeltaArrDiff} from './diff_key_array';

export const applyDeltaDiff = <T>(obj: T, diff: DeltaObjDiff): T => {
    return _.reduce(Object.keys(obj), (acc, key) => {
        let diffVal: DeltaDiff = diff[key];
        let objVal = obj[key];
        if (isDeltaArrDiff(diffVal) && isKeyArr(objVal)) {
            acc[key] = applyDeltaArrOps(objVal, diffVal)
        } else if (isDeltaStatic(diffVal) && isDeltaStatic(objVal)) {
            acc[key] = new Delta(objVal.ops).compose(diffVal);
        } else if (!_.isUndefined(diffVal)) {
            acc[key] = diffVal;
        } else {
            acc[key] = objVal;
        }
        return acc;
    }, <T>{});
};
