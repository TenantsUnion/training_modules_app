import {expect} from 'chai';
import {createCourse, createUser, STUB_COURSE} from "../util/test_course_util";
import {userProgressHandler} from "@server/config/handler_config";
import {courseProgressSummaryViewQuery} from "@server/config/query_service_config";
import {CourseProgressSummaryView} from "@shared/course_progress_summary";
import * as MockDate from 'mockdate';
import {toDbTimestampFormat} from "@server/repository";

describe('Course Progress Summary View Query', function () {
    const nowDate = new Date();
    const now = toDbTimestampFormat(nowDate);
    beforeEach(function(){
       MockDate.set(nowDate);
    });

    after(function(){
       MockDate.reset();
    });
    it('should load the course progress summary view of two enrolled users', async function () {
        let admin = await createUser();
        let {courseId} = await createCourse({userId: admin.id, ...STUB_COURSE});
        let defaultProperties = {
            id: courseId,
            version: 0,
            contentViewed: null,
            createdAt: now,
            lastModifiedAt: now,
            lastViewedAt: null,
            modules: {},
            questionsCompleted: null,
            viewedContentIds: {},
            submittedQuestionIds: {},
            completedQuestionIds: {}
        };
        let enrolled1 = await createUser();
        let enrolled2 = await createUser();
        await userProgressHandler.enrollUserInCourse({userId: enrolled1.id, courseId});
        await userProgressHandler.enrollUserInCourse({userId: enrolled2.id, courseId});
        expect(await courseProgressSummaryViewQuery.load(courseId)).to.deep.eq(<CourseProgressSummaryView>{
            courseId,
            enrolledUsers: {
                [enrolled1.id]: {
                    userId: enrolled1.id,
                    username: enrolled1.username,
                    ...defaultProperties
                },
                [enrolled2.id]: {
                    userId: enrolled2.id,
                    username: enrolled2.username,
                    ...defaultProperties
                }
            }
        });
    });
});