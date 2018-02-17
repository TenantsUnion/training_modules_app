import {Datasource} from "../datasource";
import {ViewCourseDbData} from "@course/view/course_view_row_processor";

export interface CourseProgressDbRow {
    id: string,
    userId: string,

}
export class UserProgressViewQuery {
    constructor (protected datasource: Datasource) {
    }

     async enrolledUserProgress (userId, courseId) {
       let result = await this.datasource.query({
            // language=PostgreSQL
            text: `
              SELECT c.*, cp.*, json_agg(m.*) modules
              FROM tu.course c
                INNER JOIN (SELECT * FROM tu.course_progress cp WHERE cp.user_id = $1) cp
                  ON c.id = cp.course_id
                INNER JOIN LATERAL
                           (SELECT m.*, mp.*, json_agg(s.*) AS sections
                            FROM tu.module m
                              INNER JOIN (SELECT * FROM tu.module_progress mp WHERE mp.user_id = $1) mp
                                ON m.id = mp.module_id
                              INNER JOIN LATERAL
                                         (SELECT s.*, sp.*
                                          FROM tu.section s
                                            INNER JOIN (SELECT * FROM tu.section_progress sp WHERE sp.user_id = $1) sp
                                              ON s.id = sp.section_id
                                          WHERE s.id = ANY (m.ordered_section_ids)
                                         ) s
                                ON TRUE
                            WHERE m.id = ANY (c.ordered_module_ids)) m ON TRUE
              WHERE C.id = $2;
            `,
            values: [userId, courseId]
        });
    }
}

export const processEnrolledUserProgressRow = () => {

};
