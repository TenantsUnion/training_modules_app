import {expect} from 'chai';
import {addModule, createCourse, createUser, EMPTY_CONTENT_QUESTIONS_DELTA} from '../../test_util/test_course_util';
import {coursesHandler} from "@server/config/handler_config";
import {courseViewQuery} from "@server/views/view_query_config";

describe('Create section', function () {
    let courseId: string;
    let moduleId: string;

    beforeEach(async function () {
        await createUser();
        courseId = (await createCourse()).courseId;
        moduleId = (await addModule()).moduleId;
    });

    it('should create two section under a module in a course', async function () {
        let section1 = {
            description: 'section 1 description',
            timeEstimate: 60,
            title: 'first section',
            active: true,
            submitIndividually: true,
            contentQuestions: EMPTY_CONTENT_QUESTIONS_DELTA,
            courseId, moduleId
        };

        let section2 = {
            description: 'section 2 description',
            timeEstimate: 120,
            title: 'second section',
            submitIndividually: false,
            active: true,
            contentQuestions: EMPTY_CONTENT_QUESTIONS_DELTA,
            courseId, moduleId
        };
        let {sectionId: sectionId1} = await coursesHandler.createSection(section1);
        let {modules: [{sections: sectionDescriptions1}]} = await courseViewQuery.loadCourseTraining(courseId);
        let sectionIds1 = sectionDescriptions1.map(({id}) => id);
        expect(sectionIds1.length).to.eq(1);
        expect(sectionIds1[0]).to.eq(sectionId1);
        let {sectionId: sectionId2} = await coursesHandler.createSection(section2);
        let {modules: [{sections: sectionDescriptions2}]} = await courseViewQuery.loadCourseTraining(courseId);
        let sectionIds2 = sectionDescriptions2.map(({id}) => id);
        expect(sectionIds2.length).to.eq(2);
        expect(sectionIds2[1]).to.eq(sectionId2);

    });
});