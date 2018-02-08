import {Datasource} from "../datasource";
import {CourseDescription} from "@shared/courses";

export class AvailableSourcesViewQuery {
    constructor (private datasource: Datasource) {
    }

    async availableCoursesList (): Promise<CourseDescription[]> {
        let results = await this.datasource.query({
            // language=PostgreSQL
            text: `
              SELECT c.id, c.title, description, last_modified_at, created_at, a.admins FROM tu.course c
                INNER JOIN (
                             SELECT c.id AS course_id, array_agg(u.username) AS admins FROM tu.course c
                               INNER JOIN (SELECT username, unnest(admin_of_course_ids) AS course_ids FROM tu.user) u
                                 ON c.id = u.course_ids WHERE c.active = TRUE GROUP BY c.id) a ON a.course_id = c.id;
            `,
            values: []
        });
        return results;
    }

    async availableUserCoursesList ({userId}): Promise<CourseDescription[]> {
        let results = await this.datasource.query({
            text: `select c.id, c.description, c.time_estimate, c.created_at, c.last_modified_at from tu.course c
                INNER JOIN ((select id, username, admin_of_course_ids, enrolled_in_course_ids from tu.user u where
                $1 = ANY(u.admin)) on true
            `,
            values: [userId]
        });
        return null;
    }
}