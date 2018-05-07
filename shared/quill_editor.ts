import _ from "underscore";
import {isDeltaStatic} from './delta/typeguards_delta';
import {DeltaOperation, DeltaStatic} from "quill";

/**
 * Type definitions for handling json data from the QuillJS and Delta library.
 */

export interface QuillEditorData {
    id: string;
    version: number,
    editorJson: DeltaStatic | { ops: DeltaOperation[] };
    lastModifiedAt?: string;
    createdAt?: string;
}

export interface QuillTransferData {
    id: string;
    version: number,
    lastModifiedAt?: string;
    createdAt?: string;
}

export const isQuillTransferData = (obj): obj is QuillTransferData => {
    return obj instanceof Object && !Array.isArray(obj) && typeof obj.id === 'string'
        && obj.id.substr(0, 2) === 'QD' && !obj.editorJson
};

/**
 * Returns a boolean indicating whether the provided obj is of the {@type QuillEditorData} type by checking if there
 * exists a property {@link QuillEditorData#editorJson}' that is of {@type DeltaStatic}
 *
 * @param obj
 * @returns {obj is DeltaStatic}
 */
export const isQuillEditorData = (obj: any): obj is QuillEditorData => {
    return obj && _.isObject(obj) && isDeltaStatic(obj.editorJson);
};

export type QuillDeltaMap = { [index: string]: DeltaStatic; };

/**
 * Indicates whether the provided Quill Delta represents an empty {@link DeltaStatic} with no content
 * @param {DeltaStatic} editorJson
 * @returns {boolean}
 */
export const isNotEmpty = function (editorJson: DeltaStatic) {
    return editorJson
        && _.isArray(editorJson.ops)
        && editorJson.ops.some((quillOp) => quillOp.insert !== '\n');
};
