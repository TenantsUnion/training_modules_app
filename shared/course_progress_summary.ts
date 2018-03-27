import {UserCourseProgressView} from "@shared/user_progress";

export interface CourseEnrolledUserView extends UserCourseProgressView {
    username: string;
}

/**
 * Aggregate summary of enrolled users' progress in the course specified by the courseId field
 */
export interface CourseEnrolledSummaryView {
    id: string;
    totalEnrolled: number;
    totalCompleted: number;
}