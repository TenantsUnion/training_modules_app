import {expect} from 'chai';
import {clearData} from '../../test_db_util';
import {addModule, createCourse, createUser} from './test_course_util';
import {coursesHandler} from '../../../../../server/src/config/handler_config';

describe('Create section', function () {
    let courseId: string;
    let moduleId: string;

    beforeEach(async function () {
        await clearData();
        await createUser('user1');
        courseId = await createCourse();
        moduleId = await addModule();
    });

    it('should create two section under a module in a course', async function () {
        let section1 = {
            description: 'section 1 description',
            timeEstimate: '60',
            title: 'first section',
            orderedContentQuestions: [],
            courseId, moduleId
        };

        let section2 = {
            description: 'section 2 description',
            timeEstimate: '120',
            title: 'second section',
            orderedContentQuestions: [],
            courseId, moduleId
        };
        let {course: {modules: [{orderedSectionIds: sectionIds1}]}, sectionId: sectionId1} =
            await coursesHandler.createSection(section1);
        expect(sectionIds1.length).to.eq(1);
        expect(sectionIds1[0]).to.eq(sectionId1);
        let {course: {modules: [{orderedSectionIds: sectionIds2}]}, sectionId: sectionId2} =
            await coursesHandler.createSection(section2);
        expect(sectionIds2.length).to.eq(2);
        expect(sectionIds2[1]).to.eq(sectionId2);

    });
});