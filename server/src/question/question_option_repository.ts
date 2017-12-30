import {LoggerInstance} from 'winston';
import {getLogger} from '../log';
import {Datasource} from '../datasource';
import {AbstractRepository} from '../repository';

/**
 * Question Option Data Transfer Object
 */
export interface QuestionOptionDto {
    id: string,
    questionId: string,
    answer: boolean;
    optionQuillId: string;
    explanationQuillId: string;
}

export class QuestionOptionRepository extends AbstractRepository {
    logger: LoggerInstance = getLogger('QuestionOptionRepository', 'info');

    constructor(private datasource: Datasource) {
        super('question_option_id_seq', datasource);
    }

    async createQuestionOption(insertQuestion: QuestionOptionDto): Promise<void> {
        let {id, questionId, answer, optionQuillId, explanationQuillId} = insertQuestion;

        await this.datasource.query({
            text: `INSERT INTO tu.question_option (id, question_id, answer, option_quill_id, explanation_quill_id)
                        VALUES ($1, $2, $3, $4, $5)`,
            values: [id, questionId, answer, optionQuillId, explanationQuillId]
        });
    }

    async updateQuestionOption(updateQuestion: QuestionOptionDto): Promise<void> {
        let {id, questionId, answer, optionQuillId, explanationQuillId} = updateQuestion;

        await this.datasource.query({
            text: `UPDATE tu.question_option question_id = $2, answer = $3, option_quill_id = $4,
                        explanation_quill_id = $5 WHERE id = $1`,
            values: [id, questionId, answer, optionQuillId, explanationQuillId]
        });
    }
}