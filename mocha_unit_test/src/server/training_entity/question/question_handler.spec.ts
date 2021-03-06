import {expect} from 'chai';
import {trainingEntityHandler} from '@server/config/handler_config';
import Delta from 'quill-delta';
import {
    questionOptionRepository, questionRepository
} from '@server/config/repository_config';
import {QuillEditorData} from '@shared/quill_editor';
import {QuestionOptionDto} from '@server/handlers/training/question/question_option_repository';
import {
    AnswerType, QuestionChangesObj, QuestionEntity,
    QuestionType
} from '@shared/questions';
import {
    ContentQuestionsDelta, QuillChangesObj
} from '@shared/training_entity';
import {addDeltaArrOp} from '@shared/delta/diff_key_array';
import MockDate from 'mockdate';
import {toDbTimestampFormat} from "@server/repository";
import {postgresDb} from "@server/datasource";
import {
    createdQuestionOptionPlaceholderId, createdQuestionPlaceholderId, createdQuillPlaceholderId,
    isCreatedQuillPlaceholderId,
    isQuestionId, isQuestionOptionId
} from "@shared/ids";

/**
 * Creates a question with two options in the before() test setup call. Each test then asserts a different part of the
 * functionality of creating a question with associated options and quill data.
 */
describe('Question handler create question', async function () {
    const questionQuill = new Delta().insert('Hello, world??');
    const wrongOptionQuill = new Delta().insert('incorrect answer option');
    const wrongExplanationQuill = new Delta().insert('you chose an incorrect answer');
    const correctOptionQuill = new Delta().insert('correct answer option');
    const correctExplanationQuill = new Delta().insert('congrats! you chose the correct answer');

    const questionQuillId = createdQuillPlaceholderId();
    const correctOptionQuillId = createdQuillPlaceholderId();
    const correctExplanationQuillId = createdQuillPlaceholderId();
    const wrongOptionQuillId = createdQuillPlaceholderId();
    const wrongExplanationQuillId = createdQuillPlaceholderId();

    const quillChanges: QuillChangesObj = {
        [questionQuillId]: questionQuill,
        [correctOptionQuillId]: correctOptionQuill,
        [correctExplanationQuillId]: correctExplanationQuill,
        [wrongOptionQuillId]: wrongOptionQuill,
        [wrongExplanationQuillId]: wrongExplanationQuill,
    };

    const questionPlaceholderId = createdQuestionPlaceholderId();
    const correctOptionPlaceholderId = createdQuestionOptionPlaceholderId();
    const wrongOptionPlaceholderId = createdQuestionOptionPlaceholderId();

    const createQuestionData: QuestionChangesObj = {
        [questionPlaceholderId]: {
            questionType: QuestionType.DEFAULT,
            answerType: AnswerType.DEFAULT,
            questionQuillId: questionQuillId,
            optionIds: [addDeltaArrOp(correctOptionPlaceholderId, 0), addDeltaArrOp(wrongOptionPlaceholderId, 1)],
            correctOptionIds: [addDeltaArrOp(correctOptionPlaceholderId, 0)],
            optionChangesObject: {
                [correctOptionPlaceholderId]: {
                    optionQuillId: correctOptionQuillId,
                    explanationQuillId: correctExplanationQuillId
                },
                [wrongOptionPlaceholderId]: {
                    optionQuillId: wrongOptionQuillId,
                    explanationQuillId: wrongExplanationQuillId
                },
            },
            randomizeOptionOrder: true,
            answerInOrder: false,
            canPickMultiple: false
        }
    };

    const contentQuestions: ContentQuestionsDelta = {
        quillChanges: quillChanges,
        questionChanges: createQuestionData,
        orderedContentQuestionIds: [addDeltaArrOp(questionPlaceholderId, 0)],
        orderedContentIds: [],
        orderedQuestionIds: [addDeltaArrOp(questionPlaceholderId, 0)]
    };


    let quillDataMap: { [index: string]: QuillEditorData };
    let createdQuestionOptions: QuestionOptionDto[];
    let questionId: string, correctOptionId: string, wrongOptionId: string;
    let placeholderIdMap;

    let creationDate = new Date();
    let creationDateTimestamp = toDbTimestampFormat(creationDate);
    before(function () {
        MockDate.set(creationDate);
    });

    after(function () {
        MockDate.reset();
    });

    before(async function () {
        try {
            placeholderIdMap = await trainingEntityHandler.handleContentQuestionDelta(contentQuestions);
        } catch (e) {
            console.error(`Error creating question\n${e}`);
            console.error(`${e.stack}`);
            throw e;
        }
        questionId = placeholderIdMap[questionPlaceholderId];
        correctOptionId = placeholderIdMap[correctOptionPlaceholderId];
        wrongOptionId = placeholderIdMap[wrongOptionPlaceholderId];
        let quillIds = Object.keys(placeholderIdMap).filter(key => isCreatedQuillPlaceholderId(key))
            .map(quillPlaceholderId => placeholderIdMap[quillPlaceholderId]);


        quillDataMap = (await postgresDb.query({
            text: `SELECT * FROM tu.quill_data qd WHERE qd.id = ANY($1)`,
            values: [quillIds]
        }))
            .map((row): QuillEditorData => {
                return {...row, editorJson: new Delta(row.editorJson.ops)}
            }).reduce((acc, quillData) => {
                acc[quillData.id] = quillData;
                return acc;
            }, {});

        createdQuestionOptions = await postgresDb.query({
            text: `SELECT * FROM tu.question_option qo WHERE qo.id = ANY($1)`,
            values: [[correctOptionId, wrongOptionId]]
        });
    });

    it('should create the question and options with the correct data properties', async function () {
        const expectedQuestion: QuestionEntity = {
            id: questionId,
            optionIds: [correctOptionId, wrongOptionId],
            correctOptionIds: [correctOptionId],
            questionQuillId: placeholderIdMap[questionQuillId],
            randomizeOptionOrder: createQuestionData[questionPlaceholderId].randomizeOptionOrder,
            answerType: AnswerType.DEFAULT,
            questionType: QuestionType.DEFAULT,
            canPickMultiple: createQuestionData[questionPlaceholderId].canPickMultiple,
            answerInOrder: createQuestionData[questionPlaceholderId].answerInOrder,
            version: 0,
            createdAt: creationDateTimestamp,
            lastModifiedAt: creationDateTimestamp
        };
        const questionEntity = await questionRepository.loadQuestionEntity(questionId);
        expect(isQuestionId(questionEntity.id)).to.be.true;
        expect(questionEntity.optionIds.every((id) => isQuestionOptionId(id))).to.be.true;

        expect(questionEntity).to.deep.eq(expectedQuestion);
        expect(createdQuestionOptions.length).to.equal(2);
    });

    it('should create quill data for query, options, and explanations', function () {
        const expectedQuillData = [
            questionQuill, wrongOptionQuill, wrongExplanationQuill, correctExplanationQuill, correctOptionQuill
        ];

        const createdQuillData = Object.keys(quillDataMap)
            .map((quillId) => quillDataMap[quillId])
            .map(({editorJson}) => new Delta(editorJson.ops));

        expect(createdQuillData).to.have.deep.members(expectedQuillData);
    });

    it('should associate query, option, and explanation quill references with question and question options', async function () {
        const questionEntity = await questionRepository.loadQuestionEntity(questionId);
        const correctOptionId = placeholderIdMap[correctOptionPlaceholderId];
        const wrongOptionId = placeholderIdMap[wrongOptionPlaceholderId];

        const wrongOption = await questionOptionRepository.loadQuestionOption(wrongOptionId);
        const correctOption = await questionOptionRepository.loadQuestionOption(correctOptionId);

        expect(questionEntity.questionQuillId).to.eq(placeholderIdMap[questionQuillId]);
        expect(questionEntity.correctOptionIds).to.deep.eq([correctOptionId]);
        expect(questionEntity.optionIds).to.deep.eq([correctOptionId, wrongOptionId]);

        expect(wrongOption.optionQuillId).to.eq(placeholderIdMap[wrongOptionQuillId]);
        expect(wrongOption.explanationQuillId).to.eq(placeholderIdMap[wrongExplanationQuillId]);

        expect(correctOption.optionQuillId).to.eq(placeholderIdMap[correctOptionQuillId]);
        expect(correctOption.explanationQuillId).to.eq(placeholderIdMap[correctExplanationQuillId]);
    });
})
;