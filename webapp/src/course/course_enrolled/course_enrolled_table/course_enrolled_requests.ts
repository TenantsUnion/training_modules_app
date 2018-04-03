import {CourseEnrolledView} from '@shared/course_progress_summary';
import {viewsHttpService} from '@webapp/views/views_http_service';
import {SearchViewQueryType, ViewSearchParams, ViewSearchResponse} from '@shared/views';

/**
 * Uses the search api of {@link viewsHttpService#searchViews} to query for users who are enrolled in the course
 * and fit the provided filter criteria of "q"
 * @param {string} courseId
 * @param {object} q
 * @returns {Promise<{data: CourseEnrolledView}>}
 */
export const searchCourseEnrolled = async (q: ViewSearchParams): Promise<ViewSearchResponse<CourseEnrolledView>> => {
    return (await viewsHttpService.searchViews({
        queryType: SearchViewQueryType.COURSE_ENROLLED, q
    }));
};