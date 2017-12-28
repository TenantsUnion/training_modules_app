import {Question} from 'questions';
import {Moment} from 'moment';
import {QuillEditorData} from 'quill_editor.ts';
import {Entity, EntityCommand, SaveEntityCommand} from 'entity';
import {DeltaObjDiff, QuillContentObj} from './delta/delta';
import {DeltaArrOps} from './delta/diff_key_array';
import {ContentSegment} from './segment';

export interface ViewTrainingEntity {
    id: string;
    title: string;
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

export interface TrainingEntityPayload {
    id: string;
    title: string;
    description?: string;
    timeEstimate?: string;
    active?: boolean;
    orderedContentIds: string[];
    orderedQuestionIds: string[];
    orderedContentQuestionIds: string[];
    content?: QuillEditorData[];
    questions?: Question[];
    lastModifiedAt: Moment;
}

export type TrainingEntity<T> = Entity<T, TrainingEntityPayload>;

export interface TrainingEntityDiffDelta extends DeltaObjDiff {
    title?: string;
    description?: string;
    timeEstimateMinutes?: string;
    changeQuillContent: QuillContentObj,
    orderedContentIds: DeltaArrOps
    orderedQuestionIds: DeltaArrOps;
    orderedContentQuestionIds: DeltaArrOps;
}

export type OrderedContentQuestions = (QuillEditorData | Question)[];

export interface CreateTrainingEntityPayload {
    title: string;
    description?: string;
    timeEstimate?: string | number;
    orderedContentQuestions: OrderedContentQuestions;
}

export interface SaveTrainingEntityPayload<T extends TrainingEntityDiffDelta> {
    id: string;
    changes: T;
}

export type CreateTrainingEntityCommand<T, P extends CreateTrainingEntityPayload> = EntityCommand<T, P>;

export type SaveTrainingEntityCommand<T, P extends TrainingEntityDiffDelta> = SaveEntityCommand<T, P>;

