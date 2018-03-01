import {expect} from 'chai';
import {
    addModule, addSection, createCourse, createUser, DEFAULT_COURSE_ENTITY,
    sectionEntity
} from "../util/test_course_util";
import {userProgressHandler} from "@server/config/handler_config";
import {
    courseProgressRepository, moduleProgressRepository, sectionProgressRepository,
    userRepository
} from "@server/config/repository_config";
import * as MockDate from 'mockdate';
import {toDbTimestampFormat} from "@server/repository";
import {ContentQuestionsDelta} from "@shared/training_entity";
import {createdQuestionPlaceholderId, createdQuillPlaceholderId} from "@shared/ids";
import {toAddDeltaArrOps} from "@shared/delta/diff_key_array";
import {QuestionSubmission, TrainingProgressUpdateType} from "@shared/user_progress";

describe('User progress handler', function () {
    let progressEntryDefaults;
    let now: string;
    before(async function () {
        let nowDate = new Date();
        now = toDbTimestampFormat(nowDate);
        MockDate.set(nowDate);
        progressEntryDefaults = {
            correctQuestionIds: {},
            createdAt: now,
            lastModifiedAt: now,
            trainingCompleted: null,
            lastViewedAt: null,
            submittedQuestionIds: {},
            version: 0,
            viewedContentIds: {}
        };
    });

    it('should create a progress entry for a course', async function () {
        let {id: userId} = await createUser();
        let {courseId} = await createCourse();

        await userProgressHandler.enrollUserInCourse({userId, courseId: courseId});
        let {
            0: user,
            1: courseProgress,
        } = await Promise.all([
            userRepository.loadUser(userId),
            courseProgressRepository.loadTrainingProgress({userId, id: courseId}),
        ]);

        expect(user.enrolledInCourseIds).to.deep.eq([courseId]);
        expect(courseProgress).to.deep.eq({
            id: courseId, userId, ...progressEntryDefaults
        });
    });

    it('should create course and module progress entries', async function () {
        let {id: userId} = await createUser();
        let {courseId} = await createCourse();
        let moduleId1 = await addModule();
        let moduleId2 = await addModule();

        await userProgressHandler.enrollUserInCourse({userId, courseId});
        let {
            0: user,
            1: courseProgress,
            2: module1Progress,
            3: module2Progress,
        } = await Promise.all([
            userRepository.loadUser(userId),
            courseProgressRepository.loadTrainingProgress({userId, id: courseId}),
            moduleProgressRepository.loadTrainingProgress({userId, id: moduleId1}),
            moduleProgressRepository.loadTrainingProgress({userId, id: moduleId2}),
        ]);

        expect(user.enrolledInCourseIds).to.deep.eq([courseId]);
        expect(courseProgress).to.deep.eq({
            id: courseId, userId, ...progressEntryDefaults
        });
        expect(module1Progress).to.deep.eq({
            id: moduleId1, userId, ...progressEntryDefaults
        });
        expect(module2Progress).to.deep.eq({
            id: moduleId2, userId, ...progressEntryDefaults
        });
    });

    it('should create course, module, section progress entries for enrolling in course', async function () {
        let {id: userId} = await createUser();
        let {courseId} = await createCourse();
        let moduleId1 = await addModule();
        let sectionId1 = await addSection(sectionEntity({moduleId: moduleId1}));
        let sectionId2 = await addSection(sectionEntity({moduleId: moduleId1}));
        let moduleId2 = await addModule();

        await userProgressHandler.enrollUserInCourse({userId, courseId});
        let {
            0: user,
            1: courseProgress,
            2: module1Progress,
            3: module2Progress,
            4: section1Progress,
            5: section2Progress
        } = await Promise.all([
            userRepository.loadUser(userId),
            courseProgressRepository.loadTrainingProgress({userId, id: courseId}),
            moduleProgressRepository.loadTrainingProgress({userId, id: moduleId1}),
            moduleProgressRepository.loadTrainingProgress({userId, id: moduleId2}),
            sectionProgressRepository.loadTrainingProgress({userId, id: sectionId1}),
            sectionProgressRepository.loadTrainingProgress({userId, id: sectionId2})
        ]);


        expect(user.enrolledInCourseIds).to.deep.eq([courseId]);
        expect(courseProgress).to.deep.eq({
            id: courseId, userId, ...progressEntryDefaults
        });
        expect(module1Progress).to.deep.eq({
            id: moduleId1, userId, ...progressEntryDefaults
        });
        expect(module2Progress).to.deep.eq({
            id: moduleId2, userId, ...progressEntryDefaults
        });
        expect(section1Progress).to.deep.eq({
            id: sectionId1, userId, ...progressEntryDefaults
        });
        expect(section2Progress).to.deep.eq({
            id: sectionId2, userId, ...progressEntryDefaults
        });
    });

    function defaultContentQuestions () {
        let contentId1 = createdQuillPlaceholderId();
        let contentId2 = createdQuillPlaceholderId();
        let questionId1 = createdQuestionPlaceholderId();
        let questionId2 = createdQuestionPlaceholderId();
        let contentQuestions: ContentQuestionsDelta = {
            quillChanges: {},
            questionChanges: {},
            orderedContentIds: toAddDeltaArrOps([contentId1, contentId2]),
            orderedQuestionIds: toAddDeltaArrOps([questionId1, questionId2]),
            orderedContentQuestionIds: toAddDeltaArrOps([contentId1, contentId2, questionId1, questionId2])
        };
        return {contentId1, contentId2, questionId1, questionId2, contentQuestions};
    }

    function questionSubmission (questionId: string, correct: boolean = false) {
        return {
            questionId,
            correct,
            chosenOptionIds: [],
            possibleOptionIds: []
        }
    }

    function toTimestampKeyObj(keys: string[]) {
        return keys.reduce((acc, key) => {
            acc[key] = now;
            return acc;
        }, {});
    }

    it('should save course progress', async function () {
        // will be used for assertions since placeholders aren't substituted from empty quillChanges and
        // questionChanges in contentQuestions
        let {contentId1, contentId2, questionId1, questionId2, contentQuestions} = defaultContentQuestions();
        let {id: userId} = await createUser();
        let {courseId} = await createCourse(userId, {
            ...DEFAULT_COURSE_ENTITY, contentQuestions
        });
        await userProgressHandler.enrollUserInCourse({userId, courseId});
        await userProgressHandler.recordTrainingProgress({
            userId,
            id: courseId,
            questionSubmissions: [questionSubmission(questionId1), questionSubmission(questionId2, true)],
            type: TrainingProgressUpdateType.COURSE,
            viewedContentIds: [contentId1, contentId2]
        });

        expect(await courseProgressRepository.loadTrainingProgress({id: courseId, userId})).to.deep.eq({
            userId,
            id: courseId,
            lastViewedAt: null,
            createdAt: now,
            lastModifiedAt: now,
            correctQuestionIds: toTimestampKeyObj([questionId2]),
            submittedQuestionIds: toTimestampKeyObj([questionId1, questionId2]),
            viewedContentIds: toTimestampKeyObj([contentId1, contentId2]),
            trainingCompleted: null,
            version: 0,
        });
    });

    it('should save and mark complete course progress', async function () {
        // will be used for assertions since placeholders aren't substituted from empty quillChanges and
        // questionChanges in contentQuestions
        let {contentId1, contentId2, questionId1, questionId2, contentQuestions} = defaultContentQuestions();
        let {id: userId} = await createUser();
        let {courseId} = await createCourse(userId, {...DEFAULT_COURSE_ENTITY, contentQuestions});
        await userProgressHandler.enrollUserInCourse({userId, courseId});
        await userProgressHandler.recordTrainingProgress({
            userId, id: courseId,
            type: TrainingProgressUpdateType.COURSE,
            questionSubmissions: [questionSubmission(questionId1, true), questionSubmission(questionId2, true)],
            viewedContentIds: [contentId1, contentId2]
        });

        expect(await courseProgressRepository.loadTrainingProgress({id: courseId, userId})).to.deep.eq({
            userId,
            id: courseId,
            lastViewedAt: null,
            createdAt: now,
            lastModifiedAt: now,
            correctQuestionIds: toTimestampKeyObj([questionId1, questionId2]),
            submittedQuestionIds: toTimestampKeyObj([questionId1, questionId2]),
            viewedContentIds: toTimestampKeyObj([contentId1, contentId2]),
            trainingCompleted: now,
            version: 0,
        });
    });

    it('should save module progress', async function () {
        expect.fail('')
    });

    it('should save section progress', async function () {
        expect.fail('')
    });


    it('should save and mark complete module progress', async function () {
        expect.fail('')
    });

    it('should save and mark complete a section progress', async function () {
        expect.fail('')
    });
});