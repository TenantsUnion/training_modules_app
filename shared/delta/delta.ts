import * as _ from "underscore";
import {isDeltaStatic} from './typeguards_delta';
import {DeltaArrayOp, DeltaArrDiff} from './diff_key_array';

export interface Delta extends Quill.DeltaStatic {
}

export interface DeltaObj {
    // // string is array of unique ids of child DeltaObj
    // [index: string]: Quill.DeltaStatic | Quill.DeltaStatic[] | string[] | number | boolean | string;
}


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


