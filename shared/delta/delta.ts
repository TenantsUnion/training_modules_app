import * as _ from "underscore";
import {isDeltaStatic} from './typeguards_delta';
import {DeltaArrayOp} from './diff_delta';

export interface Delta extends Quill.DeltaStatic {
}

export interface DeltaObj {
    // string is array of unique ids of child DeltaObj
    [index: string]: Quill.DeltaStatic | Quill.DeltaStatic[] | string[] | number | boolean | string;
}

export type IdsArr = string[];

export const isIdsArr = (obj: any): obj is IdsArr => {
    return obj instanceof Array && obj.every((el) => {
        return el instanceof String;
    });
};

export type DeltaArrDiff = DeltaArrayOp[];

export const isDeltaArrDiff = (obj: any): obj is DeltaArrDiff => {
    return _.isObject(obj) && !_.isArray(obj)
        && Object.keys(obj).every((key) => {
            return _.isString(key) && isDeltaArrOp(obj[key]);
        });
};

export const isDeltaArrOp = (obj: any): obj is DeltaArrayOp => {
    return _.isObject(obj) && !_.isArray(obj)
        && (obj.change === 'MOVED' || obj.change === 'ADDED' || obj.change === 'DELETED')
        && (!obj.beforeIndex || _.isString(obj.beforeIndex) || _.isNumber(obj.beforeIndex))
        && (!obj.index || _.isString(obj.index) || _.isNumber(obj.index))
        && (obj.val || (_.isString(obj.index) || _.isNumber(obj.index)));
};

export type DeltaDiff = number | boolean | string | DeltaArrDiff | QuillContentDiff;

export interface DeltaObjDiff {
    [index: string]: DeltaDiff;
}

/**
 * Represents a change to quill delta as a diff with the key as the unique primary key identifying the quill data
 * and the property is the diff as a Quill.DeltaStatic object between the old and new quill data.
 * The new version of the quill data can then be reconstructed with
 *
 */
export interface QuillContentDiff {
    [index: string]: Quill.DeltaStatic
}

export const isQuillContentDiff = (obj: any): obj is QuillContentDiff => {
    return _.isObject(obj) && !_.isArray(obj) && Object.keys(obj).every((key) => {
        return _.isString(key) && isDeltaStatic(obj[key]);
    });
};


