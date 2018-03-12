import {expect} from 'chai';
import {
    createdQuestionOptionPlaceholderId, createdQuestionPlaceholderId, createdQuillPlaceholderId,
    idType
} from "@shared/ids";
import {
    coursesRepository, moduleRepository, questionOptionRepository, questionRepository,
    quillRepository, sectionRepository
} from "@server/config/repository_config";

describe('ids', function () {
    describe('idType', function () {
        it('should return \'QUILL_DATA\' type from an id with \'QD\' prefix', async function () {
            expect(idType(await quillRepository.getNextId())).to.eq('QUILL_DATA');
        });
        it('should return \'CREATED_QUILL\' type from an id with \'QD-CREATED-QUILL\' prefix', function () {
            expect(idType(createdQuillPlaceholderId())).to.eq('CREATED_QUILL');
        });
        it('should return \'QUESTION_OPTION\' type from an id with \'QO\' prefix', async function () {
            expect(idType(await questionOptionRepository.getNextId())).to.eq('QUESTION_OPTION');
        });
        it('should return \'CREATED_QUESTION_OPTION\' type from an id with \'QO-CREATED-QUESTION-OPTION\' prefix', function () {
            expect(idType(createdQuestionOptionPlaceholderId())).to.eq('CREATED_QUESTION_OPTION');
        });
        it('should return \'QUESTION\' type from an id with \'QU\' prefix', async function () {
            expect(idType(await questionRepository.getNextId())).to.eq('QUESTION');
        });
        it('should return \'CREATED_QUESTION\' type from an id with \'QU-CREATED-QUESTION\' prefix', function () {
            expect(idType(createdQuestionPlaceholderId())).to.eq('CREATED_QUESTION');
        });
        it('should return \'COURSE\' type from an id with \'CO\' prefix', async function () {
            expect(idType(await coursesRepository.getNextId())).to.eq('COURSE');
        });
        it('should return \'MODULE\' type from an id with \'MO\' prefix', async function () {
            expect(idType(await moduleRepository.getNextId())).to.eq('MODULE')
        });
        it('should return \'SECTION\' type from an id with \'SE\' prefix', async function () {
            expect(idType(await sectionRepository.getNextId())).to.eq('SECTION')
        });
    });
});