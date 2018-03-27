import {CourseDescription, CoursesListingView} from "@shared/courses";
import {getLogger} from "../../log";
import {Datasource} from "../../datasource";

export class UserCoursesListingViewQuery {
    logger = getLogger('UserCoursesListingViewQuery', 'info');

    constructor (private datasource: Datasource) {
    }

    async loadUserAdminCourses (userId: string): Promise<CourseDescription[]> {
        return await this.datasource.query({
            // language=PostgreSQL
            text: `
              SELECT c.id, c.title, c.description, c.time_estimate FROM tu.course c JOIN
                (SELECT unnest(u.admin_of_course_ids) AS admin_course_id FROM tu.user u WHERE u.id = $1) u
                  ON c.id = u.admin_course_id`,
            values: [userId]
        });
    }

    async loadUserEnrolledCourses (userId: string): Promise<CourseDescription[]> {

        return await this.datasource.query({
            // language=PostgreSQL
            text: `
              SELECT c.id, c.title, c.description, c.time_estimate FROM tu.course c JOIN
                (SELECT unnest(u.enrolled_in_course_ids) AS enrolled_course_id FROM tu.user u WHERE u.id = $1) u
                  ON c.id = u.enrolled_course_id`,
            values: [userId]
        });

    }

    async coursesListingView (userId: string): Promise<CoursesListingView> {
        let {admin, enrolled} =  await this.datasource.query({
            // language=PostgreSQL
            text: `
              SELECT json_agg(ac.*) AS admin, json_agg(ec.*) AS enrolled FROM tu.user u LEFT JOIN
                (SELECT id, title, description, time_estimate FROM tu.course) ac ON ac.id = ANY (u.admin_of_course_ids)
                LEFT JOIN
                (SELECT id, title, description, time_estimate FROM tu.course) ec
                  ON ec.id = ANY (u.enrolled_in_course_ids)
              WHERE u.id = $1
            `,
            values: [userId]
        });
        //filter empty rows from joining admin -> enrolled -> user
        return {
            userId,
            admin: admin.filter((c) => c),
            enrolled: enrolled.filter((c) => c)
        }
    }
}

