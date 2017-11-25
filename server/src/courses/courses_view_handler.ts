import {AdminCourseDescription, EnrolledCourseDescription} from '../../../shared/courses';
import {getLogger} from '../log';
import {ICoursesRepository} from './courses_repository';

export class CoursesViewHandler {
    logger = getLogger('CourseViewHandler', 'info');

    constructor(private coursesRepository: ICoursesRepository) {
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
            let userAdminCourses = await this.coursesRepository.loadUserAdminCourses(username);
            this.logger.log('trace', `Found ${userAdminCourses.length} for user ${username}: ${JSON.stringify(userAdminCourses, null, 2)}`);
            return userAdminCourses;
        } catch (e) {
            this.logger.error(e);
            this.logger.error(e.stack);
            throw e;
        }
    }
}
