import * as _ from 'underscore';
import {CreateQuestionData, QuestionChanges, QuestionChangesObj} from 'questions';
import {Moment} from 'moment';
import {QuillEditorData} from 'quill_editor.ts';
import {EntityCommand, SaveEntityCommand} from 'entity';
import {DeltaObjDiff} from './delta/delta';
import {applyDeltaArrOps, DeltaArrOp} from './delta/diff_key_array';
import {ContentSegment} from './segment';
import {isDeltaStatic} from './delta/typeguards_delta';

export interface ViewTrainingEntity {
    id: string;
    title: string;
    version: string | number;
    description?: string;
    timeEstimate?: string;
    active: boolean;
}

export interface ViewTrainingEntityTransferData extends ViewTrainingEntity {
    lastModifiedAt: string | any;
    orderedContentIds: string[],
    orderedQuestionIds: string[],
    orderedContentQuestionIds: string[],
}

export interface ViewTrainingEntityQuillData extends ViewTrainingEntityTransferData {
    lastModifiedAt: Moment;
    content: ContentSegment[];
    // todo handle questions
}


/**
 * Represents a change to quill delta as a diff with the key as the unique primary key identifying the quill data
 * and the property is the diff as a Quill.DeltaStatic object between the old and new quill data.
 * The new version of the quill data can then be reconstructed with
 *
 */
export interface QuillChangesObj {
    [index: string]: Quill.DeltaStatic
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
    orderedContentIds: (string | number)[];
    orderedQuestionIds: (string | number)[];
    orderedContentQuestionIds: (string | number)[];
}

export interface ContentQuestionsDelta {
    quillChanges: QuillChangesObj,
    questionChanges: QuestionChangesObj;
    orderedContentQuestionIds: DeltaArrOp[];
    orderedContentIds?: DeltaArrOp[];
    orderedQuestionIds?: DeltaArrOp[];
}

export const convertContentQuestionsDeltaToEntity = (delta: ContentQuestionsDelta): ContentQuestionEntity => {
    const {orderedContentIds, orderedQuestionIds, orderedContentQuestionIds} = delta;
    return {
        orderedContentIds: applyDeltaArrOps([], orderedContentIds),
        orderedQuestionIds: applyDeltaArrOps([], orderedQuestionIds),
        orderedContentQuestionIds: applyDeltaArrOps([], orderedContentQuestionIds)
    };
};

export interface TrainingEntity extends ContentQuestionEntity {
    id: string;
    version: string | number;
    title: string;
    description?: string;
    timeEstimate?: string | number;
    active?: boolean;
    lastModifiedAt: Date;
    createdAt: Date;
}


export interface TrainingEntityDiffDelta extends DeltaObjDiff, ContentQuestionsDelta {
    title?: string;
    description?: string;
    timeEstimateMinutes?: string;
}

export type CreateContentQuestion = QuillEditorData | CreateQuestionData;

export interface CreateTrainingEntityPayload {
    title: string;
    description?: string;
    timeEstimate?: string | number;
    contentQuestions: ContentQuestionsDelta;
}

export interface SaveTrainingEntityPayload<T extends TrainingEntityDiffDelta> {
    id: string;
    changes: T;
}

export type CreateTrainingEntityCommand<T, P extends CreateTrainingEntityPayload> = EntityCommand<T, P>;

export type SaveTrainingEntityCommand<T, P extends TrainingEntityDiffDelta> = SaveEntityCommand<T, P>;

