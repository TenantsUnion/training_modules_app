import * as _ from 'underscore';
import {expect} from 'chai';
import {coursesHandler} from '../../../../../server/src/config/handler_config';
import {CreateModuleEntityPayload} from '../../../../../shared/modules';
import {getLogger} from '../../../../../server/src/log';
import {clearData} from '../../test_db_util';
import {createCourse, createUser} from './test_course_util';

describe('Create module', function () {
    let logger = getLogger('CoursesHandlerTest', 'debug');
    let courseId: string;

    beforeEach(async function () {
        await clearData();
        await createUser('user1');
        courseId = await createCourse();
    });
    it('should create a module in a course', async function () {
        let module1: CreateModuleEntityPayload = {
            courseId,
            description: 'Module 1 description blerg',
            timeEstimate: '60',
            title: 'first module',
            orderedContentQuestions: [],
            active: true
        };

        let module2: CreateModuleEntityPayload = {
            courseId,
            description: 'Module 2 description',
            timeEstimate: '120',
            title: 'second module',
            orderedContentQuestions: [],
            active: false
        };
        let {course: {orderedModuleIds: moduleIds1}, moduleId: moduleId1} = await coursesHandler.createModule(module1);
        expect(moduleIds1.length).to.eq(1);
        expect(moduleIds1[0]).to.eq(moduleId1);
        let {course: {modules, orderedModuleIds: moduleIds2}, moduleId: moduleId2} = await coursesHandler.createModule(module2);
        expect(moduleIds2.length).to.eq(2);
        expect(moduleIds2[1]).to.eq(moduleId2);

        // todo use http://sinonjs.org/ to mock new Date() in order to be able to test lastModifiedTime being updated when course is modified
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
            timeEstimate: "60",
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
            timeEstimate: "120",
            title: "second module",
            version: 0
        };
        expect(_.pick(modules[1], Object.keys(expectedModule2))).to.deep.eq(expectedModule2);
    });
});