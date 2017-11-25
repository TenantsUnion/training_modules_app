import {Question} from 'questions';
import {Moment} from 'moment';
import {QuillEditorData} from 'quill_editor.ts';
import {Entity, EntityCommand, SaveEntityCommand} from 'entity';
import {DeltaArrDiff, DeltaObjDiff, QuillContentDiff} from './delta/delta';

export interface TrainingEntityPayload {
    id: string;
    title: string;
    description: string;
    timeEstimate: string;
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

export interface CreateTrainingEntityPayload {
    title: string;
    description?: string;
    timeEstimate?: string;
    orderedContentQuestions: (QuillEditorData | Question)[];
}

export type CreateTrainingEntityCommand<T, P extends CreateTrainingEntityPayload> = EntityCommand<T, P>;

export type SaveTrainingEntityCommand<T, P extends TrainingEntityDiffDelta> = SaveEntityCommand<T, P>;

