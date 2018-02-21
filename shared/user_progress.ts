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

export interface TrainingProgressUpdate {
    viewedContentIds: DeltaArrOp<string>[];
    questionSubmissions: QuestionSubmission[];
}

export interface QuestionSubmission {
    questionId: string;
    questionOptionId: string;
    correct: boolean;
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

export interface SectionProgress extends TrainingProgress {}

