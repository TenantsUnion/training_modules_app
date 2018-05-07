import _ from 'underscore';
import {CreateQuestionData, QuestionChangesObj, QuestionQuillData} from './questions';
import {QuillEditorData} from './quill_editor';
import {Command, CommandType} from './entity';
import {DeltaObjDiff} from './delta/delta';
import {DeltaArrOp} from './delta/diff_key_array';
import {isDeltaStatic} from './delta/typeguards_delta';
import {DeltaOperation, DeltaStatic} from "quill";

export enum TrainingType {
    COURSE = 'COURSE',
    MODULE = 'MODULE',
    SECTION = 'SECTION',
}

export interface TrainingView {
    id: string;
    trainingType: TrainingType;
    title: string;
    version: number;
    description?: string;
    timeEstimate?: number;
    active: boolean;
    submitIndividually?: boolean;
    lastModifiedAt?: string;
    createdAt?: string;
    contentQuestions: (QuillEditorData | QuestionQuillData)[];
    subTrainings?: SubTrainingView[];
    subTrainingsLabel?: string;
}

export interface SubTrainingView {
    id: string;
    title: string;
    version: number;
    description?: string;
    timeEstimate?: number;
    active?: boolean;
    subTrainings?: SubTrainingView[];
    subTrainingsLabel?: string;
}

export interface TrainingDescriptionView {
    id: string,
    active: boolean,
    title: string,
    version: number,
    lastModifiedAt: string,
    timeEstimate?: number;
    createdAt: string,
    description?: string
    slug?: string,
    content: number,
    questions: number
}

/**
 * Represents a change to quill delta as a diff with the key as the unique primary key identifying the quill data
 * and the property is the diff as a Quill.DeltaStatic object between the old and new quill data.
 * The new version of the quill data can then be reconstructed with
 *
 */
export interface QuillChangesObj {
    [index: string]: DeltaStatic | { ops: DeltaOperation[] }
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
    submitIndividually?: boolean;
    orderedContentIds: string[];
    orderedQuestionIds: string[];
    orderedContentQuestionIds: string[];
}

export interface ContentQuestionsDelta extends DeltaObjDiff {
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

export interface TrainingEntityDelta extends ContentQuestionsDelta {
    title?: string;
    description?: string;
    timeEstimate?: number;
    active?: boolean;
    subTrainings?: DeltaArrOp<string>[]
}

/**
 * Indicates whether the provided training entity delta has any basic property, quill content, or question changes
 * @param {TrainingEntityDelta} delta
 * @returns {boolean}
 */
export const hasChanges = (delta: TrainingEntityDelta) => {
    return Object.keys(delta).some((key) => {
        let val = delta[key];
        if (Array.isArray(val)) {
            // indicates a non empty array of change operations
            return val.length > 0;
        } else if (typeof val === 'object') {
            // question/quill changes objects have keys corresponding to the changed quill data or question
            return Object.keys(val).length > 0;
        } else {
            // primitive property changed to new value
            return true;
        }
    });
};

export type CreateContentQuestion = QuillEditorData | CreateQuestionData;

export interface CreateTrainingEntityPayload {
    title: string;
    description?: string;
    timeEstimate?: number;
    submitIndividually: boolean;
    active: boolean;
    contentQuestions: ContentQuestionsDelta;
}

export interface SaveTrainingEntityPayload<T extends TrainingEntityDelta> {
    id: string;
    changes: T;
    contentQuestions: ContentQuestionsDelta;
}

export type CreateTrainingEntityCommand<T extends CommandType, P extends CreateTrainingEntityPayload> = Command<T, P>;
export type SaveTrainingEntityCommand<T extends CommandType, P extends TrainingEntityDelta> = Command<T, P>;
