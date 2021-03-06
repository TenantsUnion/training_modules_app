import {LoggerInstance} from 'winston';
import {
    ViewCourseData
} from '@shared/courses';
import {processCourseView} from "./process_training_view";
import {getLogger} from "@server/log";
import {Datasource} from "@server/datasource";

export class CourseTrainingViewQuery {
    logger: LoggerInstance = getLogger('CourseViewQuery', 'info');

    constructor (private datasource: Datasource) {
    }

    async loadCourseTraining (courseId: string): Promise<ViewCourseData> {
        let query = {
            // language=PostgreSQL
            text: `
              SELECT c.*, m.modules, q.questions, qd.content
              FROM tu.course c
                INNER JOIN LATERAL
                           (SELECT json_agg(m.*) AS modules
                            FROM (SELECT m.*, s.sections
                                  FROM tu.module m
                                    INNER JOIN LATERAL
                                               (SELECT json_agg(s.*) AS sections
                                                FROM tu.section s
                                                WHERE s.id = ANY (m.ordered_section_ids)) s ON TRUE
                                  WHERE m.id = ANY (c.ordered_module_ids)) m) m ON TRUE
                INNER JOIN LATERAL
                           (SELECT jsonb_agg(q.*) AS questions
                            FROM (SELECT q.*, to_json(qq.*) AS question_quill, o.options
                                  FROM tu.question q
                                    INNER JOIN tu.quill_data qq ON qq.id = q.question_quill_id
                                    INNER JOIN LATERAL (SELECT json_agg(o.*) AS options
                                                        FROM (SELECT o.*, to_json(qo.*) AS option,
                                                                to_json(qe.*) AS explanation
                                                              FROM tu.question_option o
                                                                INNER JOIN tu.quill_data qo ON qo.id = o.option_quill_id
                                                                INNER JOIN tu.quill_data qe
                                                                  ON qe.id = o.explanation_quill_id
                                                             ) o
                                                        WHERE o.id = ANY (q.option_ids)) o
                                      ON TRUE) q
                            WHERE q.id = ANY (C.ordered_question_ids)) q ON TRUE
                INNER JOIN LATERAL
                           ( SELECT json_agg(qd.*) AS CONTENT
                             FROM tu.quill_data qd
                             WHERE
                               qd.id = ANY (C.ordered_content_ids)) qd ON TRUE
              WHERE C.id = $1;
            `,
            values: [courseId]
        };
        try {
            this.logger.log('info', 'querying for admin course');
            this.logger.log('debug', `sql => ${query.text}`);
            let results = await this.datasource.query(query);
            let processedResults = results.map((row) => processCourseView(row));
            return <ViewCourseData> processedResults[0];
        } catch (e) {
            this.logger.log('error', e);
            this.logger.log('error', e.stack);
            throw e;
        }
    }
}
