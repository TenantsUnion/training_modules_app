import {DeltaArrOp} from './diff_key_array';
import {QuillChangesObj} from '../training_entity';
import {OptionChangesObj, QuestionChangesObj} from '../questions';

export interface Delta extends Quill.DeltaStatic {
}

export interface DeltaObj {
    // // string is array of unique ids of child DeltaObj
    // [index: string]: Quill.DeltaStatic | Quill.DeltaStatic[] | string[] | number | boolean | string;
}


export type DeltaDiff = number | boolean | string | DeltaArrOp[] | QuillChangesObj | QuestionChangesObj | OptionChangesObj;

export type DeltaObjDiff = {
    [index: string]: DeltaDiff;
}



