import {DeltaArrOp} from "@shared/delta/diff_key_array";

export interface TrainingProgress {
    id: string;
    version: number;
    viewedContentIds: string[],
    contentIds: string[]
    correctQuestionIds: string[],
    submittedQuestionIds: string[]
    lastViewedAt: string | null;
    lastModifiedAt: string;
    createdAt: string;
}

export interface TrainingProgressUpdateData {
    id: string; // course, module, or section id
    viewedContentIds: DeltaArrOp<string>[];
    questionSubmissions: QuestionSubmission[];
}

export enum TrainingProgressUpdateType {
    COURSE = 'COURSE', MODULE = 'MODULE', SECTION = 'SECTION'
}

export interface TrainingProgressUpdate extends TrainingProgressUpdateData {
    userId: string;
    type: TrainingProgressUpdateType
}

export type CourseTrainingProgressUpdate = TrainingProgressUpdate & { type: TrainingProgressUpdateType.COURSE };
export type ModuleTrainingProgressUpdate = TrainingProgressUpdate & { type: TrainingProgressUpdateType.MODULE };
export type SectionTrainingProgressUpdate = TrainingProgressUpdate & { type: TrainingProgressUpdateType.SECTION };

export interface QuestionSubmission {
    questionId: string;
    chosenOptionIds: string[];
    possibleOptionIds: string[];
    correct?: boolean;
}

export interface UserQuestionSubmission extends QuestionSubmission {
    userId: string;
}

export interface ContentProgress {
    quillId: string;
    viewed: boolean;
}

export interface QuestionProgress {
    questionId: string;
    answered: QuestionAnswered;
}

enum QuestionAnswered {
    NOT_ATTEMPTED = 'NOT_ATTEMPTED',
    ATTEMPTED = 'SUBMITTED',
    CORRECT = 'CORRECT'
}

export interface CourseProgress extends TrainingProgress {
    userId: string;
    modules: ModuleProgress
}

export type CourseProgressId = { courseId: string, userId: string };

export interface ModuleProgress extends TrainingProgress {
    sections: SectionProgress;
}

export interface SectionProgress extends TrainingProgress {
}

