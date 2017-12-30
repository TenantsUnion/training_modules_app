import {QuillEditorData} from './quill_editor';
import {DeltaStatic} from 'quill';

export interface CreateQuestion {
    query: DeltaStatic,
    options: CreateQuestionOption[]
    required: boolean;
}

export interface Question {
    id: string;
    query: QuillEditorData;
    options: QuestionOption[];
    required: boolean;
}

export interface QuestionTransferData {
    id: string;
    queryId: string;
    options: QuestionOptionTransferData[]
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

export interface CreateQuestionOption {
    answer: boolean;
    option: DeltaStatic;
    explanation: DeltaStatic;
}

export interface QuestionOptionTransferData {
    id: string;
    answer: boolean;
    optionId: string;
    explanationId: string;

}

export interface QuestionOption {
   id: string;
   answer: boolean;
   option: QuillEditorData;
   explanation: QuillEditorData;
}