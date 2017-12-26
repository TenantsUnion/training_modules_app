import * as _ from 'underscore';
import {AdminCourseDescription, EnrolledCourseDescription, ViewCourseTransferData} from '../../../shared/courses';
import {getLogger} from '../log';
import {CoursesRepository} from './courses_repository';
import {CoursesQueryService} from './courses_query_service';

export class CoursesViewHandler {
    logger = getLogger('CourseViewHandler', 'info');

    constructor(private coursesRepository: CoursesRepository,
                private courseQueryService: CoursesQueryService) {
    }

    async getUserEnrolledCourses(username: string): Promise<EnrolledCourseDescription[]> {
        try {
            return await this.coursesRepository.loadUserEnrolledCourses(username);
        } catch (e) {
            this.logger.error(e);
            this.logger.error(e.stack);
            throw e;
        }
    }

    async getUserAdminCourses(userId: string): Promise<AdminCourseDescription[]> {
        try {
            this.logger.info(`Retrieving admin courses for user ${userId}`);
            let userAdminCourses = await this.coursesRepository.loadUserAdminCourses(userId);
            this.logger.log('trace', `Found ${userAdminCourses.length} for user ${userId}: ${JSON.stringify(userAdminCourses, null, 2)}`);
            return userAdminCourses;
        } catch (e) {
            this.logger.error(e);
            this.logger.error(e.stack);
            throw e;
        }
    }

    async loadUserAdminCourse(courseSlug: string, userId: string): Promise<ViewCourseTransferData> {
        let courseId = await this.courseQueryService.courseIdFromSlug(courseSlug, userId);
        let course = await this.coursesRepository.loadAdminCourse(courseId);
        return _.extend({}, course, {slug: courseSlug});
    }

    async loadAdminCourse(courseId: string, userId: string): Promise<ViewCourseTransferData> {
        this.logger.info(`Loading admin course: ${courseId}`);
        let adminCourse = await this.coursesRepository.loadAdminCourse(courseId);
        let courseSlug = await this.courseQueryService.courseSlug(userId, adminCourse.title, courseId, true);

        return _.extend({}, adminCourse, {slug: courseSlug});
    }
}
