import MockDate from 'mockdate';
import {expect} from 'chai';
import {
    addModule, addSection, createCourse, createUser, createSectionPayload, STUB_COURSE, STUB_CONTENT_QUESTIONS,
    STUB_QUESTION_ID, STUB_OPTION_ID_1, STUB_OPTION_ID_2, STUB_CONTENT_ID
} from "@mocha-root/test_util/test_course_util";
import {coursesHandler, userProgressHandler} from "@server/config/handler_config";
import {toDbTimestampFormat} from "@server/repository";
import {userProgressViewQuery} from "@server/views/view_query_config";
import {TrainingProgressUpdateType, UserCourseProgressView} from "@shared/user_progress";

describe('User Progress View Query', function () {
    let nowDate = new Date();
    let now = toDbTimestampFormat(nowDate);
    let defaultEmpty = {
        version: 0,
        questionsCompleted: null,
        contentViewed: null,
        lastViewedAt: null,
        createdAt: now,
        lastModifiedAt: now,
        viewedContentIds: {},
        submittedQuestionIds: {},
        completedQuestionIds: {}
    };

    let adminId: string;
    before(async function () {
        adminId = (await createUser()).id;
    });
    beforeEach(function () {
        MockDate.set(now);
    });

    after(function () {
        MockDate.reset();
    });

    it('should load a view of an enrolled user\'s progress of a course with two modules and two sections', async function () {
        let {id: userId} = await createUser();
        let {courseId} = await createCourse();
        let {moduleId: moduleId1} = await addModule();
        let {sectionId: sectionId1} = await addSection(createSectionPayload({moduleId: moduleId1}));
        let {sectionId: sectionId2} = await addSection(createSectionPayload({moduleId: moduleId1}));
        let {moduleId: moduleId2} = await addModule();

        await userProgressHandler.enrollUserInCourse({userId, courseId});

        expect(await userProgressViewQuery.loadUserCourseProgress({userId, courseId})).to.deep.eq(<UserCourseProgressView>{
                ...defaultEmpty,
                id: courseId,
                version: 0,
                userId: userId,
                courseCompleted: null,
                modules: {
                    [moduleId1]: {
                        ...defaultEmpty,
                        id: moduleId1,
                        moduleCompleted: null,
                        sections: {
                            [sectionId1]: {
                                ...defaultEmpty, id: sectionId1,
                            },
                            [sectionId2]: {
                                ...defaultEmpty, id: sectionId2
                            }
                        },
                    },
                    [moduleId2]: {
                        ...defaultEmpty,
                        id: moduleId2,
                        moduleCompleted: null,
                        sections: {},
                    }
                }
            }
        );
    });

    it('should load a view of an enrolled user\'s progress of a completed course', async function () {
        let idMap = await coursesHandler.createCourse({...STUB_COURSE, userId: adminId, contentQuestions: STUB_CONTENT_QUESTIONS});
        let {
            courseId,
            [STUB_QUESTION_ID]: questionId,
            [STUB_CONTENT_ID]: contentId,
            [STUB_OPTION_ID_1]: optionId1,
            [STUB_OPTION_ID_2]: optionId2,
        } = idMap;
        let {id: userId} = await createUser();

        await userProgressHandler.enrollUserInCourse({userId, courseId});
        await userProgressHandler.saveTrainingProgress({
            userId, id: idMap.courseId,
            type: TrainingProgressUpdateType.COURSE,
            questionSubmissions: [{
                questionId,
                chosenQuestionOptionIds: [optionId1],
                possibleQuestionOptionIds: [optionId1, optionId2],
                correct: true
            }],
            viewedContentIds: [contentId]
        });

        expect(await userProgressViewQuery.loadUserCourseProgress({userId, courseId})).to.deep.eq(<UserCourseProgressView>{
            ...defaultEmpty,
            id: courseId,
            version: 0,
            userId: userId,
            modules: {},
            lastViewedAt: now,
            questionsCompleted: now,
            contentViewed: now,
            courseCompleted: null,
            completedQuestionIds: {
                [questionId]: now
            },
            submittedQuestionIds: {
                [questionId]: now
            },
            viewedContentIds: {
                [contentId]: now
            }
        });
    });
});