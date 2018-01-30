import * as _ from 'underscore';
import {expect} from 'chai';
import {coursesHandler, coursesViewHandler} from '../../../../../server/src/config/handler_config';
import {CreateModuleEntityPayload} from '@shared/modules';
import {clearData} from '../../test_db_util';
import {createCourse, createUser, EMPTY_CONTENT_QUESTIONS_DELTA} from '../test_course_util';
import {Delta} from '@shared/normalize_imports';
import {moduleRepository, quillRepository} from '../../../../../server/src/config/repository_config';
import {createdQuillPlaceholderId} from '@shared/quill_editor';
import {addDeltaArrOp} from '@shared/delta/diff_key_array';

describe('Create module', function () {
    let courseId: string;

    beforeEach(async function () {
        await clearData();
        await createUser();
        let courseIdMap = await createCourse();
        courseId = courseIdMap.courseId;
    });

    it('should create two modules in a course', async function () {
        let module1: CreateModuleEntityPayload = {
            courseId,
            description: 'Module 1 description blerg',
            timeEstimate: 60,
            title: 'first module',
            contentQuestions: EMPTY_CONTENT_QUESTIONS_DELTA,
            active: true
        };

        let module2: CreateModuleEntityPayload = {
            courseId,
            description: 'Module 2 description',
            timeEstimate: 120,
            title: 'second module',
            contentQuestions: EMPTY_CONTENT_QUESTIONS_DELTA,
            active: false
        };
        let moduleId1 = await coursesHandler.createModule(module1);
        let {orderedModuleIds: moduleIds1} = await coursesViewHandler.loadAdminCourse(courseId);
        expect(moduleIds1.length).to.eq(1);
        expect(moduleIds1[0]).to.eq(moduleId1);
        let moduleId2 = await coursesHandler.createModule(module2);
        let {modules, orderedModuleIds: moduleIds2} = await coursesViewHandler.loadAdminCourse(courseId);
        expect(moduleIds2.length).to.eq(2);
        expect(moduleIds2[1]).to.eq(moduleId2);

        const expectedModule1 = {
            active: true,
            description: "Module 1 description blerg",
            headerDataId: null,
            id: moduleIds1[0],
            orderedContentIds: [],
            orderedContentQuestionIds: [],
            orderedQuestionIds: [],
            orderedSectionIds: [],
            sections: [],
            timeEstimate: 60,
            title: "first module",
            version: 0
        };
        expect(_.pick(modules[0], Object.keys(expectedModule1))).to.deep.eq(expectedModule1);
        let expectedModule2 = {
            active: false,
            description: "Module 2 description",
            headerDataId: null,
            id: moduleIds2[1],
            orderedContentIds: [],
            orderedContentQuestionIds: [],
            orderedQuestionIds: [],
            orderedSectionIds: [],
            sections: [],
            timeEstimate: 120,
            title: "second module",
            version: 0
        };
        expect(_.pick(modules[1], Object.keys(expectedModule2))).to.deep.eq(expectedModule2);
    });

    it('should create a module with one quill content element', async function () {
        const placeholderQuillId = createdQuillPlaceholderId();
        const content = new Delta().insert('Some content');
        let createModulePayload: CreateModuleEntityPayload = {
            courseId,
            description: 'Module 1 description blerg',
            timeEstimate: 60,
            title: 'first module',
            contentQuestions: {
                ...EMPTY_CONTENT_QUESTIONS_DELTA,
                orderedContentQuestionIds: [addDeltaArrOp(placeholderQuillId, 0)],
                orderedContentIds: [addDeltaArrOp(placeholderQuillId, 0)],
                quillChanges: {
                    [placeholderQuillId]: content
                }
            },
            active: true
        };

        let moduleId = await coursesHandler.createModule(createModulePayload);
        let {orderedModuleIds} = await coursesViewHandler.loadAdminCourse(courseId);

        let module = await moduleRepository.loadModuleEntity(moduleId);
        let quillContent = await quillRepository.loadQuillData(module.orderedContentIds[0]);

        expect(orderedModuleIds.length).to.equal(1);
        expect(module.orderedContentIds.length).to.equal(1);
        expect(quillContent.editorJson.ops).to.deep.equal(content.ops);
    });
});