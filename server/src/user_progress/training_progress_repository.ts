import {Datasource} from "../datasource";
import {AbstractRepository, getUTCNow} from "../repository";
import {TrainingProgressUpdate} from "@shared/user_progress";

export interface TrainingProgressRowUpdate {
    id: string,
    userId: string,
    correctQuestionIds: string[],
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
              INSERT INTO tu.${this.table()} (user_id, id, last_modified_at, created_at)
                VALUES  ($1, $2, $3, $3)`,
            values: [userId, id, getUTCNow()]
        });
    }


    async bulkCreateTrainingProgress ({ids, userId}: {ids: string[], userId: string}) {
        let time = getUTCNow();
        let insertColumnsSql = `INSERT INTO tu.${this.table()} (user_id, id, last_modified_at, created_at) values `;

        return this.sqlTemplate.query({
            text: insertColumnsSql + ids.map((id, index) => `($1, $${index + 3}, $2, $2)`).join(','),
            values: [userId, time, ...ids]
        });
    }

    async saveTrainingProgress (trainingProgress: TrainingProgressRowUpdate) {
        let {id, userId, correctQuestionIds, viewedContentIds, submittedQuestionIds} = trainingProgress;
        await this.sqlTemplate.query({
            // language=PostgreSQL
            text: `
              UPDATE tu.${this.table()} SET
                correct_question_ids   = $1 :: JSONB || correct_question_ids,
                viewed_content_ids     = $2 :: JSONB || viewed_content_ids,
                submitted_question_ids = $3 :: JSONB || submitted_question_ids
              WHERE user_id = $4 AND id = $5
            `,
            values: [
                toIdTimestampObj(correctQuestionIds),
                toIdTimestampObj(viewedContentIds),
                toIdTimestampObj(submittedQuestionIds),
                userId, id
            ]
        });
    }

    async loadTrainingProgress ({id, userId}: TrainingProgressId) {
        let results = await this.sqlTemplate.query({
            // language=PostgreSQL
            text: `
              SELECT * FROM tu.${this.table()} tp WHERE tp.id = $1 AND tp.user_id = $2;
            `,
            values: [id, userId]
        });
        return results[0];
    }

    abstract table (): string;
}

const toIdTimestampObj = (ids: string[]): { [id: string]: string } => {
    let now = getUTCNow();
    return ids.reduce((acc, id) => {
        acc[id] = now;
        return acc;
    }, {})
};
