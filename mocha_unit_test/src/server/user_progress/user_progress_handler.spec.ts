import {expect} from 'chai';
import {
    addModule, addSection, createCourse, createUser, STUB_COURSE, STUB_MODULE,
    createSectionPayload
} from "../util/test_course_util";
import {userProgressHandler} from "@server/config/handler_config";
import {
    courseProgressRepository, moduleProgressRepository, sectionProgressRepository,
    userRepository
} from "@server/config/repository_config";
import * as MockDate from 'mockdate';
import {toDbTimestampFormat} from "@server/repository";
import {ContentQuestionsDelta} from "@shared/training_entity";
import {createdQuestionOptionPlaceholderId, createdQuestionPlaceholderId, createdQuillPlaceholderId} from "@shared/ids";
import {toAddDeltaArrOps} from "@shared/delta/diff_key_array";
import {TrainingProgressUpdateType} from "@shared/user_progress";
import {AnswerType, QuestionType} from "@shared/questions";

describe('User progress handler', function () {
    let nowDate = new Date();
    let now = toDbTimestampFormat(nowDate);
    let progressEntryDefaults = {
        correctQuestionIds: {},
        createdAt: now,
        lastModifiedAt: now,
        trainingCompleted: null,
        lastViewedAt: null,
        submittedQuestionIds: {},
        version: 0,
        viewedContentIds: {}
    };
    let studentId: string;
    let adminId: string;
    beforeEach(async function () {
        [{id: adminId}, {id: studentId}] = await Promise.all([createUser(), createUser()])
        MockDate.set(nowDate);
    });

    after(async function () {
        MockDate.reset();
    });

    it('should create a progress entry for a course', async function () {
        let {courseId} = await createCourse({userId: adminId, ...STUB_COURSE});

        await userProgressHandler.enrollUserInCourse({userId: studentId, courseId});
        let {
            0: user,
            1: courseProgress,
        } = await Promise.all([
            userRepository.loadUser(studentId),
            courseProgressRepository.loadTrainingProgress({userId: studentId, id: courseId}),
        ]);

        expect(user.enrolledInCourseIds).to.deep.eq([courseId]);
        expect(courseProgress).to.deep.eq({
            id: courseId, userId: studentId, ...progressEntryDefaults
        });
    });

    it('should create course and module progress entries', async function () {
        let {courseId} = await createCourse({userId: adminId, ...STUB_COURSE});
        let {moduleId: moduleId1} = await addModule();
        let {moduleId: moduleId2} = await addModule();

        await userProgressHandler.enrollUserInCourse({userId: studentId, courseId});
        let {
            0: user,
            1: courseProgress,
            2: module1Progress,
            3: module2Progress,
        } = await Promise.all([
            userRepository.loadUser(studentId),
            courseProgressRepository.loadTrainingProgress({userId: studentId, id: courseId}),
            moduleProgressRepository.loadTrainingProgress({userId: studentId, id: moduleId1}),
            moduleProgressRepository.loadTrainingProgress({userId: studentId, id: moduleId2}),
        ]);

        expect(user.enrolledInCourseIds).to.deep.eq([courseId]);
        expect(courseProgress).to.deep.eq({
            id: courseId, userId: studentId, ...progressEntryDefaults
        });
        expect(module1Progress).to.deep.eq({
            id: moduleId1, userId: studentId, ...progressEntryDefaults
        });
        expect(module2Progress).to.deep.eq({
            id: moduleId2, userId: studentId, ...progressEntryDefaults
        });
    });

    it('should create course, module, section progress entries for enrolling in course', async function () {
        let {courseId} = await createCourse({userId: adminId, ...STUB_COURSE});
        let {moduleId: moduleId1} = await addModule();
        let {sectionId: sectionId1} = await addSection(createSectionPayload({moduleId: moduleId1}));
        let {sectionId: sectionId2} = await addSection(createSectionPayload({moduleId: moduleId1}));
        let {moduleId: moduleId2} = await addModule();

        await userProgressHandler.enrollUserInCourse({userId: studentId, courseId});
        let {
            0: user,
            1: courseProgress,
            2: module1Progress,
            3: module2Progress,
            4: section1Progress,
            5: section2Progress
        } = await Promise.all([
            userRepository.loadUser(studentId),
            courseProgressRepository.loadTrainingProgress({userId: studentId, id: courseId}),
            moduleProgressRepository.loadTrainingProgress({userId: studentId, id: moduleId1}),
            moduleProgressRepository.loadTrainingProgress({userId: studentId, id: moduleId2}),
            sectionProgressRepository.loadTrainingProgress({userId: studentId, id: sectionId1}),
            sectionProgressRepository.loadTrainingProgress({userId: studentId, id: sectionId2})
        ]);


        expect(user.enrolledInCourseIds).to.deep.eq([courseId]);
        expect(courseProgress).to.deep.eq({
            id: courseId, userId: studentId, ...progressEntryDefaults
        });
        expect(module1Progress).to.deep.eq({
            id: moduleId1, userId: studentId, ...progressEntryDefaults
        });
        expect(module2Progress).to.deep.eq({
            id: moduleId2, userId: studentId, ...progressEntryDefaults
        });
        expect(section1Progress).to.deep.eq({
            id: sectionId1, userId: studentId, ...progressEntryDefaults
        });
        expect(section2Progress).to.deep.eq({
            id: sectionId2, userId: studentId, ...progressEntryDefaults
        });
    });


    it('should save course training progress', async function () {
        let {contentId1, contentId2, questionId1, questionId2, contentQuestions} = defaultContentQuestions();
        let idMap = await createCourse({...STUB_COURSE, contentQuestions, userId: adminId});
        let courseId = idMap.courseId;
        questionId1 = idMap[questionId1];
        questionId2 = idMap[questionId2];
        await userProgressHandler.enrollUserInCourse({userId: studentId, courseId});
        await userProgressHandler.saveTrainingProgress({
            userId: studentId, id: courseId,
            questionSubmissions: [questionSubmission(questionId1), questionSubmission(questionId2, true)],
            type: TrainingProgressUpdateType.COURSE,
            viewedContentIds: [contentId1, contentId2]
        });

        expect(await courseProgressRepository.loadTrainingProgress({id: courseId, userId: studentId})).to.deep.eq({
            ...progressEntryDefaults,
            id: courseId, userId: studentId,
            lastViewedAt: now,
            correctQuestionIds: toTimestampKeyObj([questionId2]),
            submittedQuestionIds: toTimestampKeyObj([questionId1, questionId2]),
            viewedContentIds: toTimestampKeyObj([contentId1, contentId2]),
        });
    });

    it('should save and mark complete course progress', async function () {
        let {contentId1, contentId2, questionId1, questionId2, contentQuestions} = defaultContentQuestions();
        let idMap = await createCourse({...STUB_COURSE, userId: adminId, contentQuestions});
        let courseId = idMap.courseId;
        questionId1 = idMap[questionId1];
        questionId2 = idMap[questionId2];
        await userProgressHandler.enrollUserInCourse({userId: studentId, courseId});
        await userProgressHandler.saveTrainingProgress({
            userId: studentId, id: courseId,
            type: TrainingProgressUpdateType.COURSE,
            questionSubmissions: [questionSubmission(questionId1, true), questionSubmission(questionId2, true)],
            viewedContentIds: [contentId1, contentId2]
        });

        expect(await courseProgressRepository.loadTrainingProgress({id: courseId, userId: studentId})).to.deep.eq({
            ...progressEntryDefaults,
            userId: studentId,
            id: courseId,
            lastViewedAt: now,
            correctQuestionIds: toTimestampKeyObj([questionId1, questionId2]),
            submittedQuestionIds: toTimestampKeyObj([questionId1, questionId2]),
            viewedContentIds: toTimestampKeyObj([contentId1, contentId2]),
            trainingCompleted: now,
        });
    });

    it('should save module training progress', async function () {
        let {contentId1, contentId2, questionId1, questionId2, contentQuestions} = defaultContentQuestions();
        let {courseId} = await createCourse({userId: adminId, ...STUB_COURSE});
        let idMap = await addModule({...STUB_MODULE, contentQuestions, courseId});
        let moduleId = idMap.moduleId;
        questionId1 = idMap[questionId1];
        questionId2 = idMap[questionId2];

        await userProgressHandler.enrollUserInCourse({userId: studentId, courseId});
        await userProgressHandler.saveTrainingProgress({
            userId: studentId, id: moduleId,
            questionSubmissions: [questionSubmission(questionId1), questionSubmission(questionId2, true)],
            type: TrainingProgressUpdateType.MODULE,
            viewedContentIds: [contentId1, contentId2]
        });

        expect(await moduleProgressRepository.loadTrainingProgress({id: moduleId, userId: studentId})).to.deep.eq({
            ...progressEntryDefaults,
            id: moduleId, userId: studentId,
            version: 0,
            lastViewedAt: now,
            correctQuestionIds: toTimestampKeyObj([questionId2]),
            submittedQuestionIds: toTimestampKeyObj([questionId1, questionId2]),
            viewedContentIds: toTimestampKeyObj([contentId1, contentId2]),
        });
    });

    it('should save and mark complete module progress', async function () {
        let {contentId1, contentId2, questionId1, questionId2, contentQuestions} = defaultContentQuestions();
        let {courseId} = await createCourse({userId: adminId, ...STUB_COURSE});
        let idMap = await addModule({...STUB_MODULE, contentQuestions, courseId});
        let moduleId = idMap.moduleId;
        questionId1 = idMap[questionId1];
        questionId2 = idMap[questionId2];

        await userProgressHandler.enrollUserInCourse({userId: studentId, courseId});
        await userProgressHandler.saveTrainingProgress({
            userId: studentId, id: moduleId,
            questionSubmissions: [questionSubmission(questionId1, true), questionSubmission(questionId2, true)],
            type: TrainingProgressUpdateType.MODULE,
            viewedContentIds: [contentId1, contentId2]
        });

        expect(await moduleProgressRepository.loadTrainingProgress({id: moduleId, userId: studentId})).to.deep.eq({
            ...progressEntryDefaults,
            id: moduleId, userId: studentId,
            trainingCompleted: now,
            lastViewedAt: now,
            correctQuestionIds: toTimestampKeyObj([questionId1, questionId2]),
            submittedQuestionIds: toTimestampKeyObj([questionId1, questionId2]),
            viewedContentIds: toTimestampKeyObj([contentId1, contentId2]),
        });
    });

    it('should save section progress', async function () {
        let {contentId1, contentId2, questionId1, questionId2, contentQuestions} = defaultContentQuestions();
        let {courseId} = await createCourse({userId: adminId, ...STUB_COURSE});
        let {moduleId} = await addModule();
        let idMap = await addSection({...STUB_MODULE, contentQuestions, courseId, moduleId});
        let sectionId = idMap.sectionId;
        questionId1 = idMap[questionId1];
        questionId2 = idMap[questionId2];

        await userProgressHandler.enrollUserInCourse({userId: studentId, courseId});
        await userProgressHandler.saveTrainingProgress({
            userId: studentId, id: sectionId,
            questionSubmissions: [questionSubmission(questionId1), questionSubmission(questionId2, true)],
            type: TrainingProgressUpdateType.SECTION,
            viewedContentIds: [contentId1, contentId2]
        });

        expect(await sectionProgressRepository.loadTrainingProgress({id: sectionId, userId: studentId})).to.deep.eq({
            id: sectionId, userId: studentId,
            version: 0,
            trainingCompleted: null,
            lastViewedAt: now,
            createdAt: now,
            lastModifiedAt: now,
            correctQuestionIds: toTimestampKeyObj([questionId2]),
            submittedQuestionIds: toTimestampKeyObj([questionId1, questionId2]),
            viewedContentIds: toTimestampKeyObj([contentId1, contentId2]),
        });
    });

    it('should save and mark complete a section progress', async function () {
        let {contentId1, contentId2, questionId1, questionId2, contentQuestions} = defaultContentQuestions();
        let {courseId} = await createCourse({userId: adminId, ...STUB_COURSE});
        let {moduleId} = await addModule();
        let idMap = await addSection({...STUB_MODULE, contentQuestions, courseId, moduleId});
        let sectionId = idMap.sectionId;
        questionId1 = idMap[questionId1];
        questionId2 = idMap[questionId2];

        await userProgressHandler.enrollUserInCourse({userId: studentId, courseId});
        await userProgressHandler.saveTrainingProgress({
            userId: studentId, id: sectionId,
            questionSubmissions: [questionSubmission(questionId1, true), questionSubmission(questionId2, true)],
            type: TrainingProgressUpdateType.SECTION,
            viewedContentIds: [contentId1, contentId2]
        });

        expect(await sectionProgressRepository.loadTrainingProgress({id: sectionId, userId: studentId})).to.deep.eq({
            id: sectionId, userId: studentId,
            version: 0,
            trainingCompleted: now,
            lastViewedAt: now,
            createdAt: now,
            lastModifiedAt: now,
            correctQuestionIds: toTimestampKeyObj([questionId1, questionId2]),
            submittedQuestionIds: toTimestampKeyObj([questionId1, questionId2]),
            viewedContentIds: toTimestampKeyObj([contentId1, contentId2]),
        });
    });

    /**
     * Helper Functions
     */
    function defaultContentQuestions () {
        // will be used for assertions since placeholders aren't substituted from empty quillChanges and
        // questionChanges in contentQuestions
        let contentId1 = createdQuillPlaceholderId();
        let contentId2 = createdQuillPlaceholderId();
        let questionId1 = createdQuestionPlaceholderId();
        let questionId2 = createdQuestionPlaceholderId();
        let optionId1 = createdQuestionOptionPlaceholderId();
        let optionId2 = createdQuestionOptionPlaceholderId();
        let contentQuestions: ContentQuestionsDelta = {
            quillChanges: {},
            questionChanges: {
                [questionId1]: {
                    answerInOrder: true,
                    answerType: AnswerType.DEFAULT,
                    questionType: QuestionType.DEFAULT,
                    canPickMultiple: true,
                    correctOptionIds: toAddDeltaArrOps([optionId2]),
                    optionIds: toAddDeltaArrOps([optionId1, optionId2]),
                    randomizeOptionOrder: true,
                    optionChangesObject: {}
                },
                [questionId2]: {
                    answerInOrder: true,
                    answerType: AnswerType.DEFAULT,
                    questionType: QuestionType.DEFAULT,
                    canPickMultiple: true,
                    correctOptionIds: toAddDeltaArrOps([optionId2]),
                    optionIds: toAddDeltaArrOps([optionId1, optionId2]),
                    randomizeOptionOrder: true,
                    optionChangesObject: {}
                }
            },
            orderedContentIds: toAddDeltaArrOps([contentId1, contentId2]),
            orderedQuestionIds: toAddDeltaArrOps([questionId1, questionId2]),
            orderedContentQuestionIds: toAddDeltaArrOps([contentId1, contentId2, questionId1, questionId2])
        };
        return {contentId1, contentId2, questionId1, questionId2, optionId1, optionId2, contentQuestions};
    }

    function questionSubmission (questionId: string, correct: boolean = false) {
        return {
            questionId,
            correct,
            chosenQuestionOptionIds: [],
            possibleQuestionOptionIds: []
        }
    }

    function toTimestampKeyObj (keys: string[]) {
        return keys.reduce((acc, key) => {
            acc[key] = now;
            return acc;
        }, {});
    }
});