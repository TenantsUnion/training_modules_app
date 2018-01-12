import * as _ from 'underscore';
import {isQuillEditorData, QuillEditorData} from './quill_editor';
import {DeltaStatic} from 'quill';
import {isDeltaStatic} from './delta/typeguards_delta';
import {applyDeltaArrOps, DeltaArrOp} from './delta/diff_key_array';

export enum QuestionType {
    DEFAULT = 'DEFAULT'
}

export enum AnswerType {
    DEFAULT = 'DEFAULT'
}

export interface QuestionEntity {
    id: string,
    version: number | string,
    questionQuillId: string,
    questionType: QuestionType,
    answerType: AnswerType,
    correctOptionIds: (string | number)[],
    optionIds: (string | number)[],
    randomizeOptionOrder: boolean,
    answerInOrder: boolean,
    canPickMultiple: boolean,
    createdAt: Date, // date?
    lastModifiedAt: Date
}

export interface QuestionTransferData {
    id: string;
    queryId: string;
    options: QuestionOptionTransferData[]
}

export interface CreateQuestionData {
    id: string;
    query: DeltaStatic;
    correctOptionIds: string[],
    randomizeOptionOrder: boolean,
    answerInOrder: boolean,
    canPickMultiple: boolean
    options: CreateQuestionOptionData[];
}

/**
 * Returns a boolean indicating that the provided object is {@type CreateQuestionData} by checking that
 * there exists the properties of CreateQuestionData according to their types
 * @param obj
 * @returns boolean indication whether the provided object is a question
 */
export const isCreateQuestionData = (obj: any): obj is CreateQuestionData => {
    if (!_.isObject(obj)) {
        return false;
    }

    let {query, options} = <CreateQuestionData> obj;
    return isDeltaStatic(query) && _.isArray(options)
        && options.every((option) => isCreateQuestionOptionData(option));
};

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

export const isCreateQuestionOptionData = (obj: any): obj is CreateQuestionOptionData => {
    if (!_.isObject(obj)) {
        return false;
    }
    let {answer, option, explanation} = <CreateQuestionOptionData> obj;
    return obj && _.isBoolean(answer)
        && isQuillEditorData(option) && isQuillEditorData(explanation);
};

export interface CreateQuestionOptionData {
    answer: boolean;
    option: DeltaStatic;
    explanation: DeltaStatic;
}

export type OptionQuillIdsObj = {
    explanationQuillId: string,
    optionQuillId: string
};

export type OptionChangesObj = {
    [p: string]: OptionQuillIdsObj
}

export type QuestionChanges = {
    // updates covered by overall quill changes so need to only deal with add and remove
    optionChangesObject: OptionChangesObj,

    questionQuillId: string,
    questionType: QuestionType,
    answerType: AnswerType,
    optionIds: DeltaArrOp[],
    correctOptionIds: DeltaArrOp[],
    randomizeOptionOrder: boolean,
    answerInOrder: boolean,
    canPickMultiple: boolean,
}

export const convertQuestionChangesToEntity = (id: string, changes: QuestionChanges): QuestionEntity => {
    let {
        questionQuillId, questionType, answerType, randomizeOptionOrder, answerInOrder, canPickMultiple,
        optionIds: optionIdsOps, correctOptionIds: correctOptionIdsOps
    } = changes;
    return {
        id, questionQuillId, questionType, answerType, randomizeOptionOrder, answerInOrder, canPickMultiple,
        version: 0,
        optionIds: applyDeltaArrOps([], optionIdsOps),
        correctOptionIds: applyDeltaArrOps([], correctOptionIdsOps),
        createdAt: new Date(),
        lastModifiedAt: new Date()
    };
};

export type QuestionChangesObj = { [index: string]: QuestionChanges };
