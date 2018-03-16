import {Datasource} from "../datasource";
import {CourseProgressSummaryView} from "@shared/course_progress_summary";
import {UserCourseProgressView} from "@shared/user_progress";
import {mapUserProgressView} from "./user_progress_view_query";

export class CourseProgressSummaryViewQuery {
    constructor (private datasource: Datasource) {
    }

    async load (courseId: string): Promise<CourseProgressSummaryView> {
        let enrolledUsers = (await this.datasource.query({
            // language=PostgreSQL
            text: `
              SELECT cp.*, m.modules, u.username FROM tu.course c
                INNER JOIN tu.course_progress cp ON c.id = cp.id
                LEFT JOIN tu.user u ON cp.user_id = u.id
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
        }));

        return {
            courseId,
            enrolledUsers: enrolledUsers.reduce((summary, userProgress) => {
                summary[userProgress.userId] = mapUserProgressView(userProgress);
                return summary;
            }, <{ [index: string]: UserCourseProgressView }> {})
        }
    }
}