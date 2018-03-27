import {expect} from 'chai';
import MockDate from 'mockdate';
import {
    questionRepository, quillRepository} from "@server/config/repository_config";
import Delta from "quill-delta";
import {AnswerType, QuestionEntity, QuestionType} from "@shared/questions";
import {QuestionInsertDbData} from "@server/handlers/training/question/question_repository";
import Moment from 'moment';
import {toDbTimestampFormat} from "@server/repository";

describe('Question Repository', function () {
    let now = new Date();
    let nowTimestamp = toDbTimestampFormat(now);
    beforeEach(async function () {
        MockDate.set(now);
    });

    let defaultQuestionProps = {
        answerInOrder: true,
        answerType: AnswerType.DEFAULT,
        questionType: QuestionType.DEFAULT,
        canPickMultiple: true,
        correctOptionIds: ['QO1'],
        optionIds: ['QO1'],
        randomizeOptionOrder: true
    };

    it('should create a question entity', async function () {
        const id = await questionRepository.getNextId();
        const questionQuillId = await quillRepository.insertEditorJson(new Delta().insert('the question???'));
        const questionInsertData: QuestionInsertDbData = {
            id: id,
            questionQuillId,
            ...defaultQuestionProps
        };
        await questionRepository.insertQuestion(questionInsertData);
        expect(await questionRepository.loadQuestionEntity(id)).to.deep.eq(<QuestionEntity>{
            version: 0,
            createdAt: nowTimestamp, lastModifiedAt: nowTimestamp,
            ...questionInsertData
        });
    });

    it('should update a question entity', async function () {
        const id = await questionRepository.getNextId();
        const questionQuillId = await quillRepository.insertEditorJson(new Delta().insert('the question???'));
        const questionInsertData: QuestionInsertDbData = {
            id: id,
            questionQuillId,
            ...defaultQuestionProps
        };
        await questionRepository.insertQuestion(questionInsertData);

        let updated = Moment(now).add(1, 'hour').toDate();
        MockDate.set(updated);

        const updatedQuestion = {
            id, questionQuillId, ...defaultQuestionProps,
            answerInOrder: false,
            canPickMultiple: false,
            correctOptionIds: ['QO3', 'QO2'],
            optionIds: ['QO3'],
            randomizeOptionOrder: true,
            version: 1
        };
        await questionRepository.saveQuestionEntity(updatedQuestion);

        expect(await questionRepository.loadQuestionEntity(id)).to.deep.eq(<QuestionEntity>{
            ...updatedQuestion,
            createdAt: nowTimestamp, lastModifiedAt: toDbTimestampFormat(updated),
        });

    });

    it('should create two question entities and delete the first one', async function () {

    });
});