import * as _ from 'underscore';
import {CreateQuestionData, QuestionChangesObj, QuestionQuillData, QuestionTransferData} from './questions';
import {QuillEditorData} from './quill_editor';
import {EntityCommand, SaveEntityCommand} from './entity';
import {DeltaObjDiff} from './delta/delta';
import {applyDeltaArrOps, DeltaArrOp} from './delta/diff_key_array';
import {isDeltaStatic} from './delta/typeguards_delta';
import DeltaOperation = Quill.DeltaOperation;

export interface ViewTrainingEntity {
    id: string;
    title: string;
    version: number;
    description?: string;
    timeEstimate?: number;
    active: boolean;
    answerImmediately?: boolean;
    // orderedContentIds?: string[],
    // orderedQuestionIds?: string[],
    // orderedContentQuestionIds?: string[],
    lastModifiedAt: string;
    createdAt: string;
    contentQuestions: (QuillEditorData | QuestionQuillData)[];
}

export interface ViewTrainingEntityDescription {
    id: string,
    active: boolean,
    title: string,
    version: number,
    lastModifiedAt: string,
    description?: string
}

/**
 * Represents a change to quill delta as a diff with the key as the unique primary key identifying the quill data
 * and the property is the diff as a Quill.DeltaStatic object between the old and new quill data.
 * The new version of the quill data can then be reconstructed with
 *
 */
export interface QuillChangesObj {
    [index: string]: Quill.DeltaStatic | {ops: DeltaOperation[]}
}

export const isQuillContentDiff = (obj: any): obj is QuillChangesObj => {
    return _.isObject(obj) && !_.isArray(obj) && Object.keys(obj).every((key) => {
        return _.isString(key) && isDeltaStatic(obj[key]);
    });
};

/**
 * Interface denoting a entity that has content and questions in a particular order
 */
export interface ContentQuestionEntity {
    headerDataId?: string;
    answerImmediately?: boolean;
    orderedContentIds: string[];
    orderedQuestionIds: string[];
    orderedContentQuestionIds: string[];
}

export interface ContentQuestionsDelta extends TrainingEntityDiffDelta {
    quillChanges: QuillChangesObj,
    questionChanges: QuestionChangesObj;
    orderedContentQuestionIds: DeltaArrOp<string>[];
    orderedContentIds?: DeltaArrOp<string>[];
    orderedQuestionIds?: DeltaArrOp<string>[];
}

export interface TrainingEntity extends ContentQuestionEntity {
    id: string;
    version: number;
    title: string;
    description?: string;
    timeEstimate?: number;
    active?: boolean;
    lastModifiedAt?: string;
    createdAt?: string;
}


export interface TrainingEntityDiffDelta extends DeltaObjDiff {
    title?: string;
    description?: string;
    timeEstimate?: number;
    active?: boolean;
}

export type CreateContentQuestion = QuillEditorData | CreateQuestionData;

export interface CreateTrainingEntityPayload {
    title: string;
    description?: string;
    timeEstimate?: number;
    answerImmediately: boolean;
    active: boolean;
    contentQuestions: ContentQuestionsDelta;
}

export interface SaveTrainingEntityPayload<T extends TrainingEntityDiffDelta> {
    id: string;
    changes: T;
    contentQuestions: ContentQuestionsDelta;
}

export type CreateTrainingEntityCommand<T, P extends CreateTrainingEntityPayload> = EntityCommand<T, P>;

export type SaveTrainingEntityCommand<T, P extends TrainingEntityDiffDelta> = SaveEntityCommand<T, P>;

