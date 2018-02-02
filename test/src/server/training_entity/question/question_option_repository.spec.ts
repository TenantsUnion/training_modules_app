import {expect} from 'chai';
import * as MockDate from 'mockdate';
import {clearData} from "../../test_db_util";
import {QuestionOptionDto} from "../../../../../server/src/training_entity/question/question_option_repository";
import {
    questionOptionRepository, quillRepository
} from "../../../../../server/src/config/repository_config";
import {Delta} from '@shared/normalize_imports';
import {toDbTimestampFormat} from "../../../../../server/src/repository";
import {postgresDb} from "../../../../../server/src/datasource";

describe('Question Option Repository', function () {

    let now = new Date();
    let nowTimestamp = toDbTimestampFormat(now);
    beforeEach(async function () {
        await clearData();
        MockDate.set(now);
    });

    it('should create a question option', async function () {
        let {0: optionQuillId, 1: explanationQuillId} = await quillRepository.getNextIds(2);
        await Promise.all([
            quillRepository.insertEditorJson(optionQuillId, new Delta().insert('option text')),
            quillRepository.insertEditorJson(explanationQuillId, new Delta().insert('explanation text'))
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
        } = await quillRepository.getNextIds(4);

        await Promise.all([
            quillRepository.insertEditorJson(optionQuillId1, new Delta().insert('option 1 text')),
            quillRepository.insertEditorJson(explanationQuillId1, new Delta().insert('explanation 1 text')),
            quillRepository.insertEditorJson(optionQuillId2, new Delta().insert('option 2 text')),
            quillRepository.insertEditorJson(explanationQuillId2, new Delta().insert('explanation 2 text'))
        ]);

        const {0: questionId1, 1: questionId2} = await questionOptionRepository.getNextIds(2);
        await questionOptionRepository.createQuestionOption({
            id: questionId1, optionQuillId: optionQuillId1, explanationQuillId: explanationQuillId1
        });
        await questionOptionRepository.createQuestionOption({
            id: questionId2, optionQuillId: optionQuillId2, explanationQuillId: explanationQuillId2
        });
        await questionOptionRepository.remove(questionId1);
        let allQuestionOptions = await postgresDb.query(`SELECT * FROM tu.question_option`);
        expect(allQuestionOptions.length).to.eq(1);
        expect(allQuestionOptions[0].id).to.eq(questionId2)

    });
});