import * as _ from 'underscore';
import {AdminCourseDescription, EnrolledCourseDescription, ViewCourseTransferData} from '../../../shared/courses';
import {getLogger} from '../log';
import {CoursesRepository} from './courses_repository';
import {titleToSlug} from '../../../shared/slug/title_slug_transformations';
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

    async getUserAdminCourses(username: string): Promise<AdminCourseDescription[]> {
        try {
            this.logger.info(`Retrieving admin courses for user ${username}`);
            let userAdminCourses = addAdminCourseSlugs(await this.coursesRepository.loadUserAdminCourses(username));
            this.logger.log('traceaa', `Found ${userAdminCourses.length} for user ${username}: ${JSON.stringify(userAdminCourses, null, 2)}`);
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

export const addAdminCourseSlugs = (courses: AdminCourseDescription[]): (AdminCourseDescription & { slug: string })[] => {
    let uniqueTitle = courses.reduce((acc, {title}: AdminCourseDescription) => {
        acc[title] = _.isUndefined(acc[title]);
        return acc;
    }, {});
    return courses.map((description: AdminCourseDescription) => {
        let {id, title} = description;
        return {
            slug: titleToSlug(title, !uniqueTitle[title], id),
            ...description
        };
    });
};
