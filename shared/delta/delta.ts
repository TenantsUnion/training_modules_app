import {DeltaArrOp} from './diff_key_array';
import {QuillChangesObj} from '../training';
import {OptionChangesObj, QuestionChangesObj} from '../questions';
import {DeltaStatic} from "quill";

export interface Delta extends DeltaStatic {
}

export interface DeltaObj {
    // // string is array of unique ids of child DeltaObj
    // [index: string]: Quill.DeltaStatic | Quill.DeltaStatic[] | string[] | number | boolean | string;
}


export type DeltaDiff = number | boolean | string | DeltaArrOp<any>[] | QuillChangesObj | QuestionChangesObj | OptionChangesObj;

export type DeltaObjDiff = {
    [index: string]: DeltaDiff;
}



