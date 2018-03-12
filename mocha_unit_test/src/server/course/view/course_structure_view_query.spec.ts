import {expect} from 'chai';
import {
    addModule, addSection, createCourse, createUser, createSectionPayload,
    STUB_COURSE, STUB_MODULE, STUB_SECTION
} from "../../util/test_course_util";
import {courseStructureViewQuery} from "@server/config/query_service_config";
import {ViewCourseStructure} from "@shared/courses";
import * as MockDate from 'mockdate';
import {toDbTimestampFormat} from "@server/repository";

describe('Course Structure View Query', function () {
    const nowDate = new Date();
    const now = toDbTimestampFormat(nowDate);
    beforeEach(function () {
        MockDate.set(nowDate);
    });

    it('should load the course structure of a course with two modules the first one with two sections', async function () {
        await createUser();
        let {courseId} = await createCourse();
        let {moduleId: moduleId1} = await addModule();
        let {sectionId: sectionId1} = await addSection(createSectionPayload({moduleId: moduleId1}));
        let {sectionId: sectionId2} = await addSection(createSectionPayload({moduleId: moduleId1}));
        let {moduleId: moduleId2} = await addModule();

        expect(await courseStructureViewQuery.loadCourseStructure(courseId)).to.deep.eq(<ViewCourseStructure> {
            id: courseId,
            version: 0,
            title: STUB_COURSE.title,
            description: STUB_COURSE.description,
            timeEstimate: STUB_COURSE.timeEstimate,
            active: STUB_COURSE.active,
            lastModifiedAt: now,
            createdAt: now,
            content: 0,
            questions: 0,
            modules: [
                {
                    id: moduleId1,
                    version: 0,
                    title: STUB_MODULE.title,
                    description: STUB_MODULE.description,
                    timeEstimate: STUB_MODULE.timeEstimate,
                    active: STUB_MODULE.active,
                    lastModifiedAt: now,
                    createdAt: now,
                    content: 0,
                    questions: 0,
                    sections: [
                        {
                            id: sectionId1,
                            version: 0,
                            title: STUB_SECTION.title,
                            description: STUB_SECTION.description,
                            timeEstimate: STUB_SECTION.timeEstimate,
                            active: STUB_SECTION.active,
                            lastModifiedAt: now,
                            createdAt: now,
                            content: 0,
                            questions: 0,
                        }, {
                            id: sectionId2,
                            version: 0,
                            title: STUB_SECTION.title,
                            description: STUB_SECTION.description,
                            timeEstimate: STUB_SECTION.timeEstimate,
                            active: STUB_SECTION.active,
                            lastModifiedAt: now,
                            createdAt: now,
                            content: 0,
                            questions: 0,
                        }
                    ]
                },
                {
                    id: moduleId2,
                    version: 0,
                    title: STUB_MODULE.title,
                    description: STUB_MODULE.description,
                    timeEstimate: STUB_MODULE.timeEstimate,
                    active: STUB_MODULE.active,
                    content: 0,
                    questions: 0,
                    lastModifiedAt: now,
                    createdAt: now,
                    sections: []
                }
            ]
        });
    });
});