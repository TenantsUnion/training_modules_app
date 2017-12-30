import * as _ from "underscore";
import {Moment} from 'moment';
import DeltaStatic = Quill.DeltaStatic;
import {isDeltaStatic} from './delta/typeguards_delta';

/**
 * Type definitions for handling json data from the QuillJS and Delta library.
 */

export interface QuillEditorData {
    id: string;
    version?: string,
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

let contentPlaceholderIdCounter = 0;
export const CREATED_PREFIX = 'CREATED';

export const createdContentPlaceholderId = () => {
    return `${CREATED_PREFIX}-${contentPlaceholderIdCounter++}`;
};

export const isCreatedPlaceholderId = (id: string) => {
  return id.indexOf(CREATED_PREFIX) === 0;
};

