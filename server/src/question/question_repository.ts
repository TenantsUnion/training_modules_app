import {AbstractRepository} from '../repository';
import {LoggerInstance} from 'winston';
import {getLogger} from '../log';
import {Datasource} from '../datasource';

export interface QuestionDto {
    id: string;
    questionQuillId: string;
    questionType: 'DEFAULT';
    answerType: 'DEFAULT';
    required: boolean;
}

export class QuestionRepository extends AbstractRepository {
    logger: LoggerInstance = getLogger('QuestionRepository', 'info');

    constructor(private datasource: Datasource) {
        super('question_id_seq', datasource);
    }

    async insertQuestion(insertQuestion: QuestionDto) {
        let {id, questionQuillId, questionType, answerType, required} = insertQuestion;
        await this.datasource.query({
            text: `INSERT INTO tu.question (id, question_quill_id, question_type, answer_type, required)
                    VALUES ($1, $2, $3, $4, $5)`,
            values: [id, questionQuillId, questionType, answerType, required]
        });
    }

    async updateQuestion(updateQuestions: QuestionDto) {
        let {id, questionQuillId, questionType, answerType, required} = updateQuestions;
        await this.datasource.query({
            text: `UPDATE tu.question SET question_quill_id = $2, question_type = $3, answer_type = $4, required = $5)
                    WHERE id = $1`,
            values: [id, questionQuillId, questionType, answerType, required]
        });
    }
}
