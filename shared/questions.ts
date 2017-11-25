import {QuillEditorData} from './quill_editor';

/**
 *
 */
export interface Question {
    id?: string;
    query: QuillEditorData
    options: QuestionOption[]
}

/**
 * Returns a boolean indicating that the provided object is {@type Question} by checking that there exists {@link Question#query}
 * property with a QuillEditorData
 * @param obj
 * @returns {obj is Question}
 */
export const isQuestion = (obj: any):obj is Question  => {
    return true;
};

export interface QuestionOption {
   id: string;
   answer: QuillEditorData;
   explanation: QuillEditorData;
   required: boolean;
}