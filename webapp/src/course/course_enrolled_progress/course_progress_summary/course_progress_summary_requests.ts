import {CourseEnrolledSummaryView} from "@shared/course_progress_summary";
import {viewsHttpService} from "@webapp/views/views_http_service";

export const loadCourseProgressSummary = async (courseId: string): Promise<CourseEnrolledSummaryView> => {
    return (await viewsHttpService.loadViews({
        courseProgressSummary: true,
        courseId
    })).courseProgressSummary
};