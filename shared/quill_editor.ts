import * as _ from "underscore";
import DeltaStatic = Quill.DeltaStatic;
import {isDeltaStatic} from './delta/typeguards_delta';
import DeltaOperation = Quill.DeltaOperation;

/**
 * Type definitions for handling json data from the QuillJS and Delta library.
 */

export interface QuillEditorData {
    id: string;
    version: number,
    editorJson: DeltaStatic | {ops: DeltaOperation[]};
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
 * exists a property {@link QuillEditorData#editorJson}' that is of {@type Quill.DeltaStatic}
 *
 * @param obj
 * @returns {obj is QuillEditorData}
 */
export const isQuillEditorData = (obj: any): obj is QuillEditorData => {
    return obj && _.isObject(obj) && isDeltaStatic(obj.editorJson);
};

export type QuillDeltaMap = { [index: string]: DeltaStatic; };

/* Quill Placeholder Id */
let contentPlaceholderIdCounter = 0;
export const CREATED_QUILL_PREFIX = 'QD-CREATED-QUILL';

export const createdQuillPlaceholderId = () => {
    return `${CREATED_QUILL_PREFIX}-${contentPlaceholderIdCounter++}`;
};

export const isCreatedQuillPlaceholderId = (id: string) => {
    return id.indexOf(CREATED_QUILL_PREFIX) === 0;
};

/* Question Placeholder Id */
let questionPlaceholderIdCounter = 0;
export const CREATED_QUESTION_PREFIX = 'QU-CREATED-QUESTION';

export const createdQuestionPlaceholderId = () => {
    return `${CREATED_QUESTION_PREFIX}-${questionPlaceholderIdCounter++}`;
};

export const isCreatedQuestionPlaceholderId = (id: string) => {
    return id.indexOf(CREATED_QUESTION_PREFIX) === 0;
};

/* Question Option Placeholder Id */
let questionOptionPlaceholderIdCounter = 0;
export const CREATED_QUESTION_OPTION_PREFIX = 'QO-CREATED-QUESTION-OPTION';

export const createdQuestionOptionPlaceholderId = () => {
    return `${CREATED_QUESTION_OPTION_PREFIX}-${questionOptionPlaceholderIdCounter++}`;
};

export const isCreatedQuestionOptionPlaceholderId = (id: string) => {
    return id.indexOf(CREATED_QUESTION_OPTION_PREFIX) === 0;
};
