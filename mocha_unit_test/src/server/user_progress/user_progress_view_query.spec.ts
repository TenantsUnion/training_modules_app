import * as MockDate from 'mockdate';
import {expect} from 'chai';
import {
    addModule, addSection, createCourse, createUser, DEFAULT_COURSE_ENTITY, DEFAULT_MODULE, DEFAULT_SECTION,
    sectionEntity
} from "../util/test_course_util";
import {userProgressHandler} from "@server/config/handler_config";
import {toDbTimestampFormat} from "@server/repository";
import {userProgressViewQuery} from "@server/config/query_service_config";

describe('User Progress View Query', function () {
    let now;
    let {contentQuestions, openEnrollment, ...DEFAULT_USER_COURSE_PROGRESS} = DEFAULT_COURSE_ENTITY;
    let {contentQuestions: rmModProp, ...DEFAULT_USER_MODULE_PROGRESS} = DEFAULT_MODULE;
    let {contentQuestions: rmSecProp, ...DEFAULT_USER_SECTION_PROGRESS} = DEFAULT_SECTION;
    beforeEach(function () {
        let nowDate = new Date();
        now = toDbTimestampFormat(nowDate);
        MockDate.set(now);
    });

    it('should load a view of an enrolled user\'s course progress', async function () {
        let {id: userId} = await createUser();
        let {courseId} = await createCourse();
        let moduleId1 = await addModule();
        let sectionId1 = await addSection(sectionEntity({moduleId: moduleId1}));
        let sectionId2 = await addSection(sectionEntity({moduleId: moduleId1}));
        let moduleId2 = await addModule();

        await userProgressHandler.enrollUserInCourse({userId, courseId});
        let defaultEmpty = {
            version: 0,
            lastViewedAt: null,
            createdAt: now,
            lastModifiedAt: now,
            viewedContentIds: {},
            submittedQuestionsIds: {},
            correctQuestionsIds: {},
            orderedContentIds: [],
            orderedQuestionIds: [],
            orderedContentQuestionIds: [],
        };

        expect(await userProgressViewQuery.loadUserCourseProgress({userId, courseId})).to.deep.eq({
            id: courseId,
            version: 0,
            userId: userId,
            ...DEFAULT_USER_COURSE_PROGRESS,
            ...defaultEmpty,
            orderedModuleIds: [
                moduleId1,
                moduleId2,
            ],
            modules: [
                {
                    id: moduleId1,
                    ...DEFAULT_USER_MODULE_PROGRESS,
                    ...defaultEmpty,
                    orderedSectionIds: [sectionId1, sectionId2],
                    sections: [
                        {
                            id: sectionId1,
                            ...DEFAULT_USER_SECTION_PROGRESS,
                            ...defaultEmpty
                        },
                        {
                            id: sectionId2,
                            ...DEFAULT_USER_SECTION_PROGRESS,
                            ...defaultEmpty
                        }
                    ],
                },
                {
                    id: moduleId2,
                    ...DEFAULT_USER_MODULE_PROGRESS,
                    ...defaultEmpty,
                    orderedSectionIds: [],
                    sections: []
                }
            ],
        });
    });
});