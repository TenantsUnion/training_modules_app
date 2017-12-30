import {QuillHandler} from '../quill/quill_handler';
import {QuestionOptionDto, QuestionOptionRepository} from './question_option_repository';
import {QuestionRepository} from './question_repository';
import {CreateQuestion, Question} from '../../../shared/questions';

export interface CreateQuestionResponse {
    questionId: string;
    questionOptionIds: string[]
}

export class QuestionHandler {

    constructor(private questionRepository: QuestionRepository,
                private questionOptionRepository: QuestionOptionRepository,
                private quillHandler: QuillHandler) {
    }

    async createQuestion(question: CreateQuestion): Promise<CreateQuestionResponse> {
        let {query, options} = question;
        let quillOptions = options.map(({option}) => option);
        let quillExplanations = options.map(({explanation}) => explanation);

        let queryQuillIdAsync = this.quillHandler.insertQuillContent([query]);
        let optionQuillIdsAsync = this.quillHandler.insertQuillContent(quillOptions);
        let explanationQuillIdsAsync = this.quillHandler.insertQuillContent(quillExplanations);

        let results = await Promise.all([queryQuillIdAsync, optionQuillIdsAsync, explanationQuillIdsAsync]);
        let {0: {0: queryQuillId}, 1: optionQuillIds, 2: explanationQuillIds} = results;

        let questionId = await this.questionRepository.getNextId();
        await this.questionRepository.insertQuestion({
            id: questionId,
            questionQuillId: queryQuillId,
            questionType: 'DEFAULT',
            answerType: 'DEFAULT',
            required: question.required
        });

        let questionOptionIds = await this.questionOptionRepository.getNextIds(options.length);
        let insertOptionsAsync = options.map((option, index): QuestionOptionDto => {
            return {
                id: questionOptionIds[index],
                questionId: questionId,
                optionQuillId: optionQuillIds[index],
                explanationQuillId: explanationQuillIds[index],
                answer: option.answer
            }
        }).map((optionDto: QuestionOptionDto) => {
            return this.questionOptionRepository.createQuestionOption(optionDto);
        });

        await Promise.all(insertOptionsAsync);
        return {questionId, questionOptionIds};
    }

    async updateQuestion() {

    }
}