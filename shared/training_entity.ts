import {Question} from 'questions';
import {Moment} from 'moment';
import {QuillEditorData} from 'quill_editor.ts';
import {Entity, EntityCommand, SaveEntityCommand} from 'entity';
import {DeltaObjDiff, QuillContentDiff} from './delta/delta';
import {DeltaArrDiff} from './delta/diff_key_array';
import {ContentSegment} from './segment';

export interface ViewTrainingEntity {
    id: string;
    title: string;
    description?: string;
    timeEstimate?: string;
    active: boolean;
}

export interface ViewTrainingEntityTransferData extends ViewTrainingEntity {
    slug: string;
    lastModifiedAt: string;
    orderedContentIds: string[],
    orderedQuestionIds: string[],
    orderedContentQuestionIds: string[],
}

export interface ViewTrainingEntityQuillData extends ViewTrainingEntity {
    lastModifiedAt: Moment;
    content: ContentSegment[];
    // todo handle questions
}

export interface TrainingEntityPayload {
    id: string;
    title: string;
    description?: string;
    timeEstimate?: string;
    orderedContentIds: string[];
    orderedQuestionIds: string[];
    orderedContentQuestionIds: string[];
    content: QuillEditorData[];
    questions: Question[];
    lastModifiedAt: Moment;
    fieldDeltas: TrainingEntityDiffDelta
}

export type TrainingEntity<T> = Entity<T, TrainingEntityPayload>;

export interface TrainingEntityDiffDelta extends DeltaObjDiff {
    title?: string;
    description?: string;
    timeEstimateMinutes?: string;
    changeQuillContent?: QuillContentDiff,
    orderedContentIds?: DeltaArrDiff
    orderedQuestionIds?: DeltaArrDiff;
    orderedContentQuestionIds?: DeltaArrDiff;
}

export type OrderedContentQuestions = (QuillEditorData | Question)[];

export interface CreateTrainingEntityPayload {
    title: string;
    description?: string;
    timeEstimate?: string;
    orderedContentQuestions: OrderedContentQuestions;
}

export type CreateTrainingEntityCommand<T, P extends CreateTrainingEntityPayload> = EntityCommand<T, P>;

export type SaveTrainingEntityCommand<T, P extends TrainingEntityDiffDelta> = SaveEntityCommand<T, P>;

