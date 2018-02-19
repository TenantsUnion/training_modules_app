import {expect} from 'chai';
import {clearData} from "../../test_db_util";
import {addModule, addSection, createCourse, createUser, sectionEntity} from "../util/test_course_util";
import {userProgressHandler} from "@server/config/handler_config";
import {
    courseProgressRepository, moduleProgressRepository, sectionProgressRepository,
    userRepository
} from "@server/config/repository_config";
import * as MockDate from 'mockdate';
import {toDbTimestampFormat} from "@server/repository";

describe('User progress handler', function () {
    let now: string;
    before(async function () {
        let nowDate = new Date();
        now = toDbTimestampFormat(nowDate);
        MockDate.set(nowDate);
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


        let defaults = {
            correctQuestionsIds: [],
            createdAt: now,
            lastModifiedAt: now,
            lastViewedAt: null,
            submittedQuestionsIds: [],
            userId,
            version: 0,
            viewedContentIds: []
        };

        expect(user.enrolledInCourseIds).to.deep.eq([courseId]);
        expect(courseProgress).to.deep.eq({
            courseId: courseId, ...defaults
        });
        expect(module1Progress).to.deep.eq({
            moduleId: moduleId1, ...defaults
        });
        expect(module2Progress).to.deep.eq({
            moduleId: moduleId2, ...defaults
        });
        expect(section1Progress).to.deep.eq({
            sectionId: sectionId1, ...defaults
        });
        expect(section2Progress).to.deep.eq({
            sectionId: sectionId2, ...defaults
        });
    });
});