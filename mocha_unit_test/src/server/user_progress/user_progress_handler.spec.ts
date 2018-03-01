import {expect} from 'chai';
import {addModule, addSection, createCourse, createUser, sectionEntity} from "../util/test_course_util";
import {userProgressHandler} from "@server/config/handler_config";
import {
    courseProgressRepository, moduleProgressRepository, sectionProgressRepository,
    userRepository
} from "@server/config/repository_config";
import * as MockDate from 'mockdate';
import {toDbTimestampFormat} from "@server/repository";

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
            viewedContentIds:{}
        };
    });

    it('should create a progress entry for a course', async function () {
        let {id: userId} = await createUser();
        let {courseId} = await createCourse();

        await userProgressHandler.enrollUserInCourse({userId, courseId});
        let {
            0: user,
            1: courseProgress,
        } = await Promise.all([
            userRepository.loadUser(userId),
            courseProgressRepository.loadCourseProgress({userId, courseId}),
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
            courseProgressRepository.loadCourseProgress({userId, courseId}),
            moduleProgressRepository.loadModuleProgress({userId, moduleId: moduleId1}),
            moduleProgressRepository.loadModuleProgress({userId, moduleId: moduleId2}),
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
            courseProgressRepository.loadCourseProgress({userId, courseId}),
            moduleProgressRepository.loadModuleProgress({userId, moduleId: moduleId1}),
            moduleProgressRepository.loadModuleProgress({userId, moduleId: moduleId2}),
            sectionProgressRepository.loadSectionProgress({userId, sectionId: sectionId1}),
            sectionProgressRepository.loadSectionProgress({userId, sectionId: sectionId2})
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
});