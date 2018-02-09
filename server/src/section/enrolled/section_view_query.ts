import {getLogger} from "../../log";
import {Datasource} from "../../datasource";
import {ViewSectionData} from "@shared/sections";
import {processContentQuestions} from "../../course/view/course_view_row_processor";

export class SectionViewQuery {
    logger = getLogger('SectionViewQuery');

    constructor (private datasource: Datasource) {
    }

    async loadSection (sectionId: string): Promise<ViewSectionData> {
        let query = {
            // language=PostgreSQL
            text: `
              SELECT s.*, q.questions, qd.content
              FROM tu.section s
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
                            WHERE q.id = ANY (s.ordered_question_ids)) q ON TRUE
                INNER JOIN LATERAL
                           ( SELECT json_agg(qd.*) AS CONTENT
                             FROM tu.quill_data qd
                             WHERE
                               qd.id = ANY (s.ordered_content_ids)) qd ON TRUE
              WHERE s.id = $1;
            `,
            values: [sectionId]
        };
        try {
            let results = await this.datasource.query(query);
            let row = results[0];

            let sections = row.sections ? row.sections : [];
            let {
                orderedContentIds, orderedQuestionIds, orderedContentQuestionIds,
                content, questions, ...viewSection
            } = row;

            return {
                ...viewSection,
                contentQuestions: processContentQuestions(row),
            };
        } catch (e) {
            this.logger.log('error', e);
            this.logger.log('error', e.stack);
            throw e;
        }
    }
}