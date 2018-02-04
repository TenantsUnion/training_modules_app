import {Datasource} from '../../datasource';
import {ViewModuleData} from '@shared/modules';
import {getLogger} from "../../log";
import {processModuleView} from "./module_view_row_processor";
import {orderEntitiesByIds, processContentQuestions, toEntityMap} from "../view/course_view_row_processor";

export class ModuleViewQuery {
    logger = getLogger('ModuleViewQuery', 'info');

    constructor (private datasource: Datasource) {
    }

    async loadModule (moduleId: string): Promise<ViewModuleData> {
        let query = {
            // language=PostgreSQL
            text: `
              SELECT m.*, s.sections, q.questions, qd.content
              FROM tu.module m
                INNER JOIN LATERAL
                           (SELECT json_agg(s.*) AS sections
                            FROM tu.section s
                            WHERE s.id = ANY (m.ordered_section_ids)) s ON TRUE
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
                            WHERE q.id = ANY (m.ordered_question_ids)) q ON TRUE
                INNER JOIN LATERAL
                           ( SELECT json_agg(qd.*) AS CONTENT
                             FROM tu.quill_data qd
                             WHERE
                               qd.id = ANY (m.ordered_content_ids)) qd ON TRUE
              WHERE m.id = $1;
            `,
            values: [moduleId]
        };
        try {
            this.logger.log('info', 'querying for admin course');
            this.logger.log('debug', `sql => ${query.text}`);
            let results = await this.datasource.query(query);
            let row = results[0];

            let sections = row.sections ? row.sections : [];
            let {
                orderedContentIds, orderedQuestionIds, orderedContentQuestionIds,
                content, questions, orderedSectionIds, ...viewModule
            } = row;

            return {
                ...viewModule,
                contentQuestions: processContentQuestions(row),
                sections: orderEntitiesByIds(orderedSectionIds, toEntityMap(sections))
            };
        } catch (e) {
            this.logger.log('error', e);
            this.logger.log('error', e.stack);
            throw e;
        }
    }
}