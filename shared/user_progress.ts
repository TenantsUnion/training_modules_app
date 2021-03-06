export interface TrainingProgress {
    id: string;
    version: number;
    viewedContentIds: string[],
    correctQuestionIds: string[],
    submittedQuestionIds: string[],
    questionsCompleted: string, // utc timestamp of when all possible questions were completed
    contentViewed: string, // utc timestamp of when all possible content was viewed
    lastViewedAt: string | null;
    lastModifiedAt: string;
    createdAt: string;
}

export interface TrainingProgressUpdateData {
    id: string; // course, module, or section id
    viewedContentIds: string[];
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
    chosenQuestionOptionIds: string[];
    possibleQuestionOptionIds: string[];
    correct?: boolean;
    textAnswer?: string;
}

export interface UserQuestionSubmission extends QuestionSubmission {
    userId: string;
    createdAt: string;
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

export interface TrainingProgressView {
    id: string;
    version: number;
    completedQuestionIds: {[questionId: string]: string}; // val: submission timestamps
    submittedQuestionIds: {[questionId: string]: string}; // val: submission timestamps
    viewedContentIds: {[contentId: string]: string}; // val: timestamp viewed
    questionsCompleted: string, // utc timestamp of when all possible questions were completed
    contentViewed: string, // utc timestamp of when all possible content was viewed
    createdAt: string;
    lastModifiedAt: string;
    lastViewedAt: string;
}

export interface UserModuleProgressView extends TrainingProgressView {
    sections: {[sectionId: string]: TrainingProgressView}
    moduleCompleted: string; // utc timestamp of when the training content and all sections are completed
}

export interface UserCourseProgressView extends TrainingProgressView {
    userId: string;
    courseCompleted: string; // utc timestamp of when the training content and all modules are completed
    modules: {[moduleId: string]: UserModuleProgressView},
}
