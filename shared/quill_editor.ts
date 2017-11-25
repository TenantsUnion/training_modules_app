import * as _ from "underscore";
import {Moment} from 'moment';
import DeltaStatic = Quill.DeltaStatic;
import {isDeltaStatic} from './delta/typeguards_delta';

/**
 * Type definitions for handling json data from the QuillJS and Delta library.
 */

export interface QuillEditorData {
    id?: string;
    editorJson: DeltaStatic;
    lastModified?: Moment | string;
}

/**
 * Returns a boolean indicating whether the provided obj is of the {@type QuillEditorData} type by checking if there
 * exists a property {@link QuillEditorData#editorJson}' that is of {@type Quill.DeltaStatic}
 *
 * @param obj
 * @returns {obj is QuillEditorData}
 */
export const isQuillEditorData = (obj: any): obj is QuillEditorData => {
  return obj && _.isObject(obj) && isDeltaStatic(obj.editorJson);
};

export type QuillDeltaMap = { [index: string]: DeltaStatic; };

export type FieldDeltas = {
    [index: string]: DeltaStatic
}


