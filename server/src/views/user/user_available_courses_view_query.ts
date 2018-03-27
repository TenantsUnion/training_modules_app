import {CourseDescription} from "@shared/courses";
import {Datasource} from "@server/datasource";

export class AvailableSourcesViewQuery {
    constructor (private datasource: Datasource) {
    }

    async availableCoursesList (excluding: string[] = []): Promise<CourseDescription[]> {
        let results = await this.datasource.query({
            // language=PostgreSQL
            text: `
              SELECT c.id, c.title, description, last_modified_at, created_at, a.admins FROM tu.course c
                INNER JOIN (
                             SELECT c.id AS course_id, array_agg(u.username) AS admins FROM tu.course c
                               INNER JOIN (SELECT username, unnest(admin_of_course_ids) AS course_ids FROM tu.user) u
                                 ON c.id = u.course_ids WHERE c.active = TRUE GROUP BY c.id) a ON a.course_id = c.id
              WHERE NOT (c.id = ANY ($1));
            `,
            values: [excluding]
        });
        return results;
    }

    async enrollableCourses (userId: string): Promise<CourseDescription[]> {
        // admin_of_course_ids    TEXT [] NOT NULL DEFAULT ARRAY [] :: TEXT [],
        //     enrolled_in_course_ids TEXT [] NOT NULL DEFAULT ARRAY [] :: TEXT [],
        let result = await this.datasource.query({
            text: `SELECT u.id, u.username, u.enrolled_in_course_ids, u.admin_of_course_ids FROM tu.user u where u.id = $1`,
            values: [userId]
        });
        return this.availableCoursesList([...result[0].enrolledInCourseIds, ...result[0].adminOfCourseIds]);
    }
}