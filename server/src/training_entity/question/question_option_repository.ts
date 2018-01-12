import {LoggerInstance} from 'winston';
import {getLogger} from '../../log';
import {Datasource} from '../../datasource';
import {AbstractRepository} from '../../repository';

/**
 * Question Option Data Transfer Object
 */
export interface QuestionOptionDto {
    id: string,
    optionQuillId: string;
    explanationQuillId: string;
}

export class QuestionOptionRepository extends AbstractRepository {
    logger: LoggerInstance = getLogger('QuestionOptionRepository', 'info');

    constructor(private datasource: Datasource) {
        super('question_option_id_seq', datasource);
    }

    async createQuestionOption(questionOption: QuestionOptionDto): Promise<void> {
        let {id, optionQuillId, explanationQuillId} = questionOption;

        await this.datasource.query({
            text: `INSERT INTO tu.question_option (id, option_quill_id, explanation_quill_id)
                        VALUES ($1, $2, $3)`,
            values: [id, optionQuillId, explanationQuillId]
        });
    }

    async loadQuestionOption(id: string): Promise<QuestionOptionDto> {
        let results = await this.datasource.query({
            text: `SELECT * FROM tu.question_option WHERE id = $1`,
            values: [id]
        });
        return results[0];
    }
}