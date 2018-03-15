import {Datasource} from "../datasource";
import {CourseProgressSummaryView} from "@shared/course_progress_summary";

export class CourseProgressSummaryViewQuery {
    constructor (private datasource: Datasource) {
    }

    async load (courseId: string): Promise<CourseProgressSummaryView> {
        return (await this.datasource.query({
            // language=PostgreSQL
            text: `
              SELECT c.id, c.ordered_module_ids, c.ordered_question_ids, c.ordered_content_ids,
                c.ordered_content_question_ids, cp.*, m.modules FROM tu.course c
                INNER JOIN (select * from tu.course_progress cp ON c.id = cp.id
                LEFT JOIN LATERAL
                          (
                          SELECT json_agg(m.*) AS modules FROM
                            (
                              SELECT m.id, m.ordered_section_ids, m.ordered_content_ids, m.ordered_question_ids,
                                m.ordered_content_question_ids, mp.*, s.sections
                              FROM tu.module m
                                INNER JOIN tu.module_progress mp
                                  ON m.id = mp.id
                                INNER JOIN LATERAL
                                           (
                                           SELECT json_agg(s.*) AS sections FROM
                                             (
                                               SELECT s.id, s.ordered_content_ids, s.ordered_question_ids,
                                                 s.ordered_content_question_ids, sp.*
                                               FROM tu.section s
                                                 INNER JOIN tu.section_progress sp
                                                   ON s.id = sp.id WHERE
                                                 s.id = ANY (m.ordered_section_ids)
                                             ) s
                                           ) s ON TRUE
                              WHERE m.id = ANY (c.ordered_module_ids)
                            ) m
                          ) m ON TRUE
              WHERE c.id = $1;
            `,
            values: [courseId]
        }))[0];
    }
}