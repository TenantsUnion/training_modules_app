import * as _ from 'underscore';
import {LoggerInstance} from 'winston';
import {getLogger} from '../../log';
import {Datasource} from '../../datasource';
import {
    AdminCourseDescription, EnrolledCourseDescription, UserEnrolledCourseData,
    ViewCourseTransferData
} from '../../../../shared/courses';
import {processCourseView} from './course_view_row_processor';

export class CourseViewQuery {
    logger: LoggerInstance = getLogger('CourseRepository', 'info');

    constructor (private datasource: Datasource) {
    }

    async loadUserAdminCourses (userId: string): Promise<AdminCourseDescription[]> {
        return await this.datasource.query({
            text: `
                          SELECT c.id, c.title, c.description, c.time_estimate FROM tu.course c JOIN
                            (SELECT unnest(
                                     u.admin_of_course_ids) AS admin_course_id FROM
                               tu.user u WHERE u.id = $1) u
                              ON c.id = u.admin_course_id
                        `,
            values: [userId]
        });
    }

    async loadUserEnrolledCourses (username: string): Promise<EnrolledCourseDescription[]> {
        this.logger.log('info', 'Retrieving courses for user: %s', username);

        let result = await this.datasource.query({
            text: ` SELECT id, title FROM tu.course c JOIN
                            (SELECT unnest(
                                     u.enrolled_in_course_ids) AS enrolled_course_id FROM
                               tu.user u WHERE u.username = $1) u
                              ON c.id = u.enrolled_course_id
                        `,
            values: [username]
        });

        let enrolled: EnrolledCourseDescription[] = result.map((row) => {
            return <EnrolledCourseDescription> {
                id: row.id,
                title: row.title
            };
        });

        return enrolled;
    }

    async loadUserEnrolledCourse (courseId: string): Promise<UserEnrolledCourseData> {
        let results = await this.datasource.query({
                text: `SELECT * FROM tu.course c WHERE c.id = $1`,
                values: [courseId]
            }
        );

        return results[0];
    }


    async loadAdminCourse (courseId: string): Promise<ViewCourseTransferData> {
        let query = {
            // language=PostgreSQL
            text: `
              SELECT c.*, m.modules, q.questions, qd.content FROM tu.course c
                INNER JOIN LATERAL
                           (SELECT json_agg(m.*) AS modules
                            FROM (SELECT m.*, s.sections, q.questions, qd.content FROM tu.module m
                              INNER JOIN LATERAL
                                         (SELECT json_agg(s.*) AS sections
                                          FROM (SELECT s.*, q.questions, qd.content FROM tu.section s
                                            INNER JOIN LATERAL
                                                       (SELECT jsonb_agg(q.*) AS questions FROM
                                              (SELECT q.*, o.options FROM tu.question q
                                                INNER JOIN LATERAL
                                                           (SELECT jsonb_agg(o.*) AS options FROM tu.question_option o
                                                WHERE o.id = ANY (q.option_ids)) o ON TRUE) q
                                            WHERE q.id = ANY (s.ordered_question_ids)) q ON TRUE
                                            INNER JOIN LATERAL
                                                       (SELECT jsonb_agg(qd.*) AS content
                                                        FROM (SELECT id, version, last_modified_at, created_at FROM
                                                          tu.quill_data) qd WHERE
                                                          qd.id = ANY (s.ordered_content_ids)) qd ON TRUE
                                          WHERE s.id = ANY (m.ordered_section_ids)) s) s ON TRUE
                              INNER JOIN LATERAL
                                         (SELECT jsonb_agg(q.*) AS questions
                                          FROM (SELECT q.*, o.options FROM tu.question q
                                            INNER JOIN LATERAL
                                                       (SELECT jsonb_agg(o.*) AS options FROM tu.question_option o
                                            WHERE o.id = ANY (q.option_ids)) o ON TRUE) q
                                          WHERE q.id = ANY (m.ordered_question_ids)) q ON TRUE
                              INNER JOIN LATERAL
                                         (SELECT jsonb_agg(qd.*) AS content
                                          FROM (SELECT id, version, last_modified_at, created_at FROM
                                            tu.quill_data) qd WHERE
                                            qd.id = ANY (m.ordered_content_ids)) qd ON TRUE
                            WHERE m.id = ANY (c.ordered_module_ids)) m) m ON TRUE
                INNER JOIN LATERAL
                           (SELECT jsonb_agg(q.*) AS questions
                            FROM (SELECT q.*, o.options FROM tu.question q
                              INNER JOIN LATERAL (SELECT jsonb_agg(o.*) AS options
                                                  FROM tu.question_option o
                                                  WHERE o.id = ANY (q.option_ids)) o
                                ON TRUE) q WHERE q.id = ANY (c.ordered_question_ids)) q ON TRUE
                INNER JOIN LATERAL
                           (SELECT jsonb_agg(qd.*) AS content
                            FROM (SELECT id, version, last_modified_at, created_at FROM tu.quill_data) qd WHERE
                              qd.id = ANY (c.ordered_content_ids)) qd ON TRUE
              WHERE c.id = $1;
            `,
            values: [courseId]
        };
        try {
            this.logger.log('info', 'querying for admin course');
            this.logger.log('debug', `sql => ${query.text}`);
            let results = await this.datasource.query(query);
            let processedResults = results.map((row) => processCourseView(row));
            return <ViewCourseTransferData> processedResults[0];
        } catch (e) {
            this.logger.log('error', e);
            this.logger.log('error', e.stack);
        }
    }
}
