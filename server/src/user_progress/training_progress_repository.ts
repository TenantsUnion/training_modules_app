import {Datasource} from "../datasource";
import {AbstractRepository, getUTCNow} from "../repository";
import {TrainingProgressUpdate} from "@shared/user_progress";

export interface TrainingProgressRowUpdate {
    id: string,
    userId: string,
    completedQuestionIds: string[],
    viewedContentIds: string[],
    submittedQuestionIds: string[]
}

export type TrainingProgressId = { id: string, userId: string };

export abstract class TrainingProgressRepository extends AbstractRepository {
    constructor (sqlTemplate: Datasource) {
        super('', sqlTemplate);
    }

    async createTrainingProgress ({userId, id}: TrainingProgressId) {
        await this.sqlTemplate.query({
            // language=PostgreSQL
            text: `
              INSERT INTO tu.${this.tableNames.progress} (user_id, id, last_modified_at, created_at)
                VALUES  ($1, $2, $3, $3)`,
            values: [userId, id, getUTCNow()]
        });
    }


    async bulkCreateTrainingProgress ({ids, userId}: { ids: string[], userId: string }) {
        let time = getUTCNow();
        let insertColumnsSql = `INSERT INTO tu.${this.tableNames.progress} (user_id, id, last_modified_at, created_at) values `;

        return this.sqlTemplate.query({
            text: insertColumnsSql + ids.map((id, index) => `($1, $${index + 3}, $2, $2)`).join(','),
            values: [userId, time, ...ids]
        });
    }

    async saveTrainingProgress (trainingProgress: TrainingProgressRowUpdate) {
        let {id, userId, completedQuestionIds, viewedContentIds, submittedQuestionIds} = trainingProgress;
        await this.sqlTemplate.query({
            // language=PostgreSQL
            text: `
              UPDATE tu.${this.tableNames.progress} SET
                completed_question_ids   = $1 :: JSONB || completed_question_ids,
                viewed_content_ids     = $2 :: JSONB || viewed_content_ids,
                submitted_question_ids = $3 :: JSONB || submitted_question_ids,
                last_viewed_at = $4, last_modified_at = $4
              WHERE user_id = $5 AND id = $6
            `,
            values: [
                toIdTimestampObj(completedQuestionIds),
                toIdTimestampObj(viewedContentIds),
                toIdTimestampObj(submittedQuestionIds),
                getUTCNow(),
                userId, id
            ]
        });
    }

    async markCompleted ({id, userId}: TrainingProgressId) {
        await this.sqlTemplate.query({
            // language=PostgreSQL
            text: `
              UPDATE tu.${this.tableNames.progress} p
              SET questions_completed =
              CASE WHEN p.completed_question_ids ?& t.ordered_question_ids THEN $1::TIMESTAMPTZ
              ELSE NULL END,
              content_viewed = 
              CASE WHEN p.viewed_content_ids ?& t.ordered_content_ids THEN $1::TIMESTAMPTZ
              ELSE NULL END
              FROM tu.${this.tableNames.training} t
              WHERE p.id = t.id 
              AND t.id = $2
              AND p.id = $2
                    AND p.user_id = $3
            `,
            values: [getUTCNow(), id, userId]
        })
    }

    async loadTrainingProgress ({id, userId}: TrainingProgressId) {
        let results = await this.sqlTemplate.query({
            // language=PostgreSQL
            text: `
              SELECT * FROM tu.${this.tableNames.progress} tp WHERE tp.id = $1 AND tp.user_id = $2;
            `,
            values: [id, userId]
        });
        return results[0];
    }

    abstract get tableNames (): { progress: string, training: string };

}

const toIdTimestampObj = (ids: string[]): { [id: string]: string } => {
    let now = getUTCNow();
    return ids.reduce((acc, id) => {
        acc[id] = now;
        return acc;
    }, {})
};
