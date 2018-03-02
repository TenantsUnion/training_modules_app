import {expect} from 'chai';
import * as MockDate from 'mockdate';
import {clearData} from "../../../test_db_util";
import {QuestionOptionDto} from "@server/training_entity/question/question_option_repository";
import {
    questionOptionRepository, quillRepository
} from "@server/config/repository_config";
import {Delta} from '@shared/normalize_imports';
import {toDbTimestampFormat} from "@server/repository";
import {postgresDb} from "@server/datasource";

describe('Question Option Repository', function () {

    let now = new Date();
    let nowTimestamp = toDbTimestampFormat(now);
    beforeEach(async function () {
        MockDate.set(now);
    });

    it('should create a question option', async function () {
        let {0: optionQuillId, 1: explanationQuillId} = await Promise.all([
            quillRepository.insertEditorJson(new Delta().insert('option textAnswer')),
            quillRepository.insertEditorJson(new Delta().insert('explanation textAnswer'))
        ]);

        const id = await questionOptionRepository.getNextId();
        let questionOptionDto: QuestionOptionDto = {
            id, optionQuillId, explanationQuillId
        };

        await questionOptionRepository.createQuestionOption(questionOptionDto);
        expect(await questionOptionRepository.loadQuestionOption(id)).to.deep.equal({
            version: 0,
            ...questionOptionDto,
            createdAt: nowTimestamp,
            lastModifiedAt: nowTimestamp
        });
    });

    it('should create two question options and remove the first question option', async function () {
        let {
            0: optionQuillId1, 1: explanationQuillId1,
            2: optionQuillId2, 3: explanationQuillId2
        } = await Promise.all([
            quillRepository.insertEditorJson(new Delta().insert('option 1 textAnswer')),
            quillRepository.insertEditorJson(new Delta().insert('explanation 1 textAnswer')),
            quillRepository.insertEditorJson(new Delta().insert('option 2 textAnswer')),
            quillRepository.insertEditorJson(new Delta().insert('explanation 2 textAnswer'))
        ]);

        const {0: questionId1, 1: questionId2} = await questionOptionRepository.getNextIds(2);
        await questionOptionRepository.createQuestionOption({
            id: questionId1, optionQuillId: optionQuillId1, explanationQuillId: explanationQuillId1
        });
        await questionOptionRepository.createQuestionOption({
            id: questionId2, optionQuillId: optionQuillId2, explanationQuillId: explanationQuillId2
        });
        await questionOptionRepository.remove(questionId1);
        let allQuestionOptions = await postgresDb.query({
            text: `SELECT * FROM tu.question_option qo WHERE qo.id = ANY($1)`,
            values: [[questionId1, questionId2]]
        });
        expect(allQuestionOptions.length).to.eq(1);
        expect(allQuestionOptions[0].id).to.eq(questionId2)

    });
});