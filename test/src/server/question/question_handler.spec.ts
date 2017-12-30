import {expect} from 'chai';
import {questionHandler} from '../../../../server/src/config/handler_config';
import {CreateQuestion} from '../../../../shared/questions';
import {Delta} from '../../../../shared/normalize_imports';
import {postgresDb} from '../../../../server/src/config/repository_config';
import {clearData} from '../test_db_util';
import {QuestionDto} from '../../../../server/src/question/question_repository';
import {QuillEditorData} from '../../../../shared/quill_editor';
import {QuestionOptionDto} from '../../../../server/src/question/question_option_repository';

/**
 * Creates a question with two options in the before() test setup call. Each test then asserts a different part of the
 * functionality of creating a question with associated options and quill data.
 */
describe('Question handler create question', async function () {
    const questionText = 'Hello, world??';
    const wrongOptionText = 'incorrect answer option';
    const wrongExplanationText = 'you chose an incorrect answer';
    const correctOptionText = 'correct answer option';
    const correctExplanationText = 'congrats! you chose the correct answer';

    const createQuestionData: CreateQuestion = {
        query: new Delta().insert(questionText),
        options: [{
            answer: false,
            option: new Delta().insert(wrongOptionText),
            explanation: new Delta().insert(wrongExplanationText)
        }, {
            answer: true,
            option: new Delta().insert(correctOptionText),
            explanation: new Delta().insert(correctExplanationText)
        }],
        required: true
    };

    let questionId: string, questionOptionIds: string[];
    let createdQuillData: QuillEditorData[], createdQuestion: QuestionDto;
    let createdQuestionOptions: QuestionOptionDto[], correctOption: QuestionOptionDto, wrongOption: QuestionOptionDto;
    before(async function () {
        await clearData();
        ({questionId, questionOptionIds} = await questionHandler.createQuestion(createQuestionData));
        createdQuillData = (await postgresDb.query(`SELECT * from tu.quill_data`))
            .map((row): QuillEditorData => {
                return {...row, editorJson: new Delta(row.editorJson.ops)}
            });

        createdQuestion = (await postgresDb.query(`SELECT * from tu.question`))[0];
        createdQuestionOptions = await postgresDb.query(`SELECT * from tu.question_option`);
        correctOption = createdQuestionOptions.find(({answer}) => answer);
        wrongOption = createdQuestionOptions.find(({answer}) => !answer);
    });

    it('should create the question and options with the correct data properties', function () {
        expect(createdQuestion.required).to.equal(createQuestionData.required);
        expect(createdQuestion.id).to.equal(questionId);

        expect(createdQuestionOptions.length).to.equal(2);
        createdQuestionOptions.forEach((option) => {
            expect(option.questionId).to.eq(questionId);
        });
        expect(correctOption.answer).to.be.true;
        expect(wrongOption.answer).to.be.false;
    });

    it('should create quill data for query, options, and explanations', function () {
        const expectedQuillData = [
            questionText, wrongOptionText, wrongExplanationText, correctExplanationText, correctOptionText
        ].map((text) => new Delta().insert(text));

        expect(createdQuillData.map(({editorJson}) => editorJson)).to.have.deep.members(expectedQuillData);
    });

    it('should associate query, option, and explanation quill references with question and question options', function () {
        let textIdMap = createdQuillData.reduce((acc, {id, editorJson}) => {
            let text = editorJson.ops.map(({insert}) => insert).join('');
            acc[text] = id;
            return acc;
        }, {});

        expect(createdQuestion.questionQuillId).to.eq(textIdMap[questionText]);
        expect(correctOption.optionQuillId).to.eq(textIdMap[correctOptionText]);
        expect(correctOption.explanationQuillId).to.eq(textIdMap[correctExplanationText]);
        expect(wrongOption.optionQuillId).to.eq(textIdMap[wrongOptionText]);
        expect(wrongOption.explanationQuillId).to.eq(textIdMap[wrongExplanationText]);
    });
});