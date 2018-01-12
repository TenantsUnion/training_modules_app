import {AbstractRepository} from '../../repository';
import {LoggerInstance} from 'winston';
import {getLogger} from '../../log';
import {Datasource} from '../../datasource';
import {QuestionEntity} from '../../../../shared/questions';

export interface QuestionDto {
    id: string;
    questionQuillId: string;
    questionType: 'DEFAULT';
    answerType: 'DEFAULT';
}

export class QuestionRepository extends AbstractRepository {
    logger: LoggerInstance = getLogger('QuestionRepository', 'info');

    constructor(private datasource: Datasource) {
        super('question_id_seq', datasource);
    }

    async insertQuestion(insertQuestion: QuestionEntity) {
        let {
            id, questionQuillId, questionType, answerType, correctOptionIds, optionIds,
            randomizeOptionOrder, answerInOrder, canPickMultiple
        } = insertQuestion;
        await this.datasource.query({
            text: `
                INSERT INTO tu.question
                    (id, question_quill_id, question_type, answer_type, correct_option_ids, option_ids,
                        randomize_option_order, answer_in_order, can_pick_multiple, last_modified_at, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10)
            `,
            values: [id, questionQuillId, questionType, answerType, correctOptionIds, optionIds,
                randomizeOptionOrder, answerInOrder, canPickMultiple, new Date()]
        });
    }

    async updateQuestion(updateQuestions: QuestionDto) {
        let {id, questionQuillId, questionType, answerType} = updateQuestions;
        await this.datasource.query({
            text: `UPDATE tu.question SET question_quill_id = $2, question_type = $3, answer_type = $4, required = $5)
                    WHERE id = $1`,
            values: [id, questionQuillId, questionType, answerType]
        });
    }

    async loadQuestionEntity(questionId: string): Promise<QuestionEntity> {
        let results = await this.sqlTemplate.query({
            text: `SELECT * from tu.question q where q.id = $1`,
            values: [questionId]
        });
        return results[0];
    }

    async saveQuestionEntity(questionEntity: QuestionEntity) {
        let {
            id, questionType, answerType, correctOptionIds, optionIds, randomizeOptionOrder,
            answerInOrder, canPickMultiple
        } = questionEntity;
        await this.sqlTemplate.query({
            text: `
            UPDATE tu.question SET
                question_type = $1,
                answer_type = $2,
                correct_option_ids = $3,
                option_ids = $4,
                randomize_option_order = $5,
                answer_in_order = $6,
                can_pick_multiple = $7,
                last_modified_at = $8
            where id = $9`,
            values: [questionType, answerType, correctOptionIds, optionIds,
                randomizeOptionOrder, answerInOrder, canPickMultiple, new Date(), id]
        });
    }
}
