import * as _ from "underscore";
import {ArrElementChange, DeltaArrDiff, DeltaDiff, DeltaObj, DeltaObjDiff, isDeltaArrDiff, isIdsArr} from './delta';
import {isDeltaStatic} from './typeguards_delta';

export const applyDeltaDiff = (obj: DeltaObj, diff: DeltaObjDiff): DeltaObj => {
    return _.reduce(Object.keys(obj), (acc, key) => {
        let diffVal: DeltaDiff = diff[key];
        let objVal = obj[key];
        if (isDeltaArrDiff(diffVal) && isIdsArr(objVal)) {
            acc[key] = applyDeltaArrDiff(objVal, diffVal)
        } else if (isDeltaStatic(diffVal) && isDeltaStatic(objVal)) {
            acc[key] = new Delta(objVal.ops).compose(diffVal);
        } else if (diffVal) {
            acc[key] = diffVal;
        } else {
            acc[key] = objVal;
        }
        return acc;
    }, {});
};

export const applyDeltaArrDiff = (arr: string[], diff: DeltaArrDiff): string[] => {
    return diff.reduce((applied, changeEl:ArrElementChange) => {
        switch(changeEl.change){
            case 'ADDED':
                return applied.splice(parseInt(changeEl.index + ''), 0, changeEl.val);
            case 'DELETED':
                return applied.splice(parseInt(changeEl.index + ''), 1);
            default:
                throw new Error(`Unrecognized element change ${changeEl.change}`);
        }
    }, arr.slice());
};
