export interface UserTrainingProgressSummaryView {
    id: string; // course, module, section id
    userId: string;
    /**
     * True if at one point in time the enrolled user had answered all possible questions correctly in the training.
     */
    completedQuestions: boolean;
    /**
     * True if at one point in time the enrolled user had viewed all available content in the training
     */
    completedContent: boolean;
    /**
     * The ids of the questions the enrolled user has completed
     */
    questionsCompleted: string[];
    /**
     * The ids of the content the enrolled user has viewed
     */
    contentViewed: string[];
    /**
     * The utc timestamp of when the user enrolled
     */
    enrolledAt: string;
}

export interface UserCourseProgressSummaryView extends UserTrainingProgressSummaryView {
    completedCourse: boolean;
    modules: UserModuleProgressSummaryView[];
}

export interface UserModuleProgressSummaryView extends UserTrainingProgressSummaryView {
    sections: UserTrainingProgressSummaryView[];
}


/**
 * Aggregate summary of enrolled users' progress in the course specified by the courseId field
 */
export interface CourseProgressSummaryView {
    courseId: string;
    enrolledUsers: {[id: string]: UserCourseProgressSummaryView}
}