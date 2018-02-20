import {AdminCourseDescription, EnrolledCourseDescription} from "@shared/courses";
import {getLogger} from "../log";
import {Datasource} from "../datasource";

export class UserCoursesListingViewQuery {
    logger = getLogger('UserCoursesListingViewQuery', 'info');

    constructor (private datasource: Datasource) {
    }

    async loadUserAdminCourses (userId: string): Promise<AdminCourseDescription[]> {
        return await this.datasource.query({
            // language=PostgreSQL
            text: `
              SELECT c.id, c.title, c.description, c.time_estimate FROM tu.course c JOIN
                (SELECT unnest(u.admin_of_course_ids) AS admin_course_id FROM tu.user u WHERE u.id = $1) u
                  ON c.id = u.admin_course_id`,
            values: [userId]
        });
    }

    async loadUserEnrolledCourses (userId: string): Promise<EnrolledCourseDescription[]> {

        return await this.datasource.query({
            // language=PostgreSQL
            text: `
              SELECT c.id, c.title, c.description, c.time_estimate FROM tu.course c JOIN
                (SELECT unnest(u.enrolled_in_course_ids) AS enrolled_course_id FROM tu.user u WHERE u.id = $1) u
                  ON c.id = u.enrolled_course_id`,
            values: [userId]
        });

    }
}

