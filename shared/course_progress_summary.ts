import {UserCourseProgressView} from "@shared/user_progress";

export interface EnrolledUserView extends UserCourseProgressView {
    username: string;
}
export interface CourseEnrolledView {
    /**
     * Id of course
     */
    id: string;
    users: EnrolledUserView[];
    searchCriteria: any;
}

/**
 * Aggregate summary of enrolled users' progress in the course specified by the courseId field
 */
export interface CourseEnrolledSummaryView {
    id: string;
    totalEnrolled: number;
    totalCompleted: number;
}