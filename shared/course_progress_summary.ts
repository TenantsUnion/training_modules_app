import {UserCourseProgressView} from "@shared/user_progress";
export interface UserCourseProgressSummaryView extends UserCourseProgressView {
    username: string;
}
/**
 * Aggregate summary of enrolled users' progress in the course specified by the courseId field
 */
export interface CourseProgressSummaryView {
    courseId: string;
    enrolledUsers: { [id: string]: UserCourseProgressSummaryView }
}