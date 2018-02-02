import {AdminCourseDescription, EnrolledCourseDescription, ViewCourseData} from '../../../shared/courses';
import {getLogger} from '../log';
import {CourseViewQuery} from './view/course_views_query';

export class CoursesViewHandler {
    logger = getLogger('CourseViewHandler', 'info');

    constructor(private courseViewQuery: CourseViewQuery) {}

    async getUserEnrolledCourses(username: string): Promise<EnrolledCourseDescription[]> {
        return await this.courseViewQuery.loadUserEnrolledCourses(username);
    }

    async getUserAdminCourses(userId: string): Promise<AdminCourseDescription[]> {
        return await this.courseViewQuery.loadUserAdminCourses(userId);
    }
    async loadAdminCourse(courseId: string): Promise<ViewCourseData> {
        return await this.courseViewQuery.loadAdminCourse(courseId);
    }
}
