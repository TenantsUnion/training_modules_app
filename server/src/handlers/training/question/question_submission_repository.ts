import {QuestionSubmission, UserQuestionSubmission} from "../../../../../shared/user_progress";
import {Datasource} from "../../../datasource";
import {AbstractRepository, getUTCNow} from "../../../repository";

export class QuestionSubmissionRepository extends AbstractRepository {
    constructor (datasource: Datasource) {
        super('question_submission_id', datasource);
    }

    async insertQuestionSubmissions (userId: string, submissions: QuestionSubmission[]): Promise<string[]> {
        let time = getUTCNow();
        let ids = await this.getNextIds(submissions.length);

        let params: any[] = ids
            .map((id, index) => {
                // has to match insert fields order
                let {questionId, correct, textAnswer, chosenQuestionOptionIds, possibleQuestionOptionIds} = submissions[index];
                return [id, questionId, correct, textAnswer, chosenQuestionOptionIds, possibleQuestionOptionIds]
            }).reduce((acc, el) => {
                return acc.concat(el);
            }, []);

        // build parameterized sql string based on number of submissions to insert to match params array
        let paramsSql = ids.map((id, index) => {
            //user_id and created_at remain the same for each submission
            return `($1, $2,
            $${index * 6 + 3}, $${index * 6 + 4}, $${index * 6 + 5},
            $${index * 6 + 6}, $${index * 6 + 7}, $${index * 6 + 8}
            )`
        }).join(',');


        let insertColumnsSql = `INSERT INTO tu.question_submission (
          user_id, created_at, id, question_id,
          correct, text_answer,
          chosen_question_option_ids, possible_question_option_ids
        ) VALUES `;
        await this.sqlTemplate.query({
            text: insertColumnsSql + paramsSql,
            values: [userId, time, ...params]
        });
        return ids;
    }

    async loadQuestionSubmissionByQuestionId(questionId: string): Promise<UserQuestionSubmission[]> {
        return await this.sqlTemplate.query({
            // language=PostgreSQL
            text: 'SELECT * from tu.question_submission q where q.question_id = $1 order by created_at desc',
            values: [questionId]
        });
    }

}