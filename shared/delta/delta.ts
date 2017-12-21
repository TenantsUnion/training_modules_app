import * as _ from "underscore";
import {isDeltaStatic} from './typeguards_delta';
import {DeltaArrayOp, DeltaArrDiff} from './diff_key_array';

export interface Delta extends Quill.DeltaStatic {
}

export interface DeltaObj {
    // // string is array of unique ids of child DeltaObj
    // [index: string]: Quill.DeltaStatic | Quill.DeltaStatic[] | string[] | number | boolean | string;
}

export type IdsArr = string[];

export const isIdsArr = (obj: any): obj is IdsArr => {
    return obj instanceof Array && obj.every((el) => {
        return el instanceof String;
    });
};


export const isDeltaArrDiff = (arr: any): arr is DeltaArrDiff => {
    return _.isArray(arr) && arr.every((obj) => isDeltaArrOp(obj));
};

export const isDeltaArrOp = (obj: any): obj is DeltaArrayOp => {
    return _.isObject(obj) && !_.isArray(obj)
        && (obj.op === 'MOVE' || obj.op === 'ADD' || obj.op === 'DELETE')
        && (!obj.beforeIndex || _.isString(obj.beforeIndex) || _.isNumber(obj.beforeIndex))
        && (!obj.index || _.isString(obj.index) || _.isNumber(obj.index))
        && (obj.val || (_.isString(obj.index) || _.isNumber(obj.index)));
};

export type DeltaDiff = number | boolean | string | DeltaArrDiff | QuillContentObj;

export interface DeltaObjDiff {
    [index: string]: DeltaDiff;
}

/**
 * Represents a change to quill delta as a diff with the key as the unique primary key identifying the quill data
 * and the property is the diff as a Quill.DeltaStatic object between the old and new quill data.
 * The new version of the quill data can then be reconstructed with
 *
 */
export interface QuillContentObj {
    [index: string]: Quill.DeltaStatic
}

export const isQuillContentDiff = (obj: any): obj is QuillContentObj => {
    return _.isObject(obj) && !_.isArray(obj) && Object.keys(obj).every((key) => {
        return _.isString(key) && isDeltaStatic(obj[key]);
    });
};


