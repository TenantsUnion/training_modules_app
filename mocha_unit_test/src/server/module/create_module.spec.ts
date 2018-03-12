import * as _ from 'underscore';
import {expect} from 'chai';
import {CreateModuleEntityPayload} from '@shared/modules';
import {clearData} from '../../test_db_util';
import {createCourse, createUser, EMPTY_CONTENT_QUESTIONS_DELTA} from '../util/test_course_util';
import {Delta} from '@shared/normalize_imports';
import {addDeltaArrOp} from '@shared/delta/diff_key_array';
import {createdQuillPlaceholderId} from "@shared/ids";
import {coursesHandler} from "@server/config/handler_config";
import {courseViewQuery} from "@server/config/query_service_config";
import {moduleRepository, quillRepository} from "@server/config/repository_config";

describe('Create module', function () {
    let courseId: string;

    beforeEach(async function () {
        await createUser();
        let courseIdMap = await createCourse();
        courseId = courseIdMap.courseId;
    });

    it('should create two modules in a course', async function () {
        let module1: CreateModuleEntityPayload = {
            courseId,
            description: 'Module 1 description blerg',
            timeEstimate: 60,
            submitIndividually: false,
            title: 'first module',
            contentQuestions: EMPTY_CONTENT_QUESTIONS_DELTA,
            active: true
        };

        let module2: CreateModuleEntityPayload = {
            courseId,
            description: 'Module 2 description',
            timeEstimate: 120,
            submitIndividually: true,
            title: 'second module',
            contentQuestions: EMPTY_CONTENT_QUESTIONS_DELTA,
            active: false
        };
        let {moduleId: moduleId1} = await coursesHandler.createModule(module1);
        let {modules: modules1} = await courseViewQuery.loadCourseTraining(courseId);
        let moduleIds1 = modules1.map(({id}) => id);
        expect(moduleIds1.length).to.eq(1);
        expect(moduleIds1[0]).to.eq(moduleId1);
        let {moduleId: moduleId2} = await coursesHandler.createModule(module2);
        let {modules, modules: modules2} = await courseViewQuery.loadCourseTraining(courseId);
        let moduleIds2 = modules2.map(({id}) => id);
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
            submitIndividually: true,
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

        let {moduleId} = await coursesHandler.createModule(createModulePayload);
        let {modules} = await courseViewQuery.loadCourseTraining(courseId);

        let module = await moduleRepository.loadModuleEntity(moduleId);
        let quillContent = await quillRepository.loadQuillData(module.orderedContentIds[0]);

        expect(modules.length).to.equal(1);
        expect(module.orderedContentIds.length).to.equal(1);
        expect(quillContent.editorJson.ops).to.deep.equal(content.ops);
    });
});