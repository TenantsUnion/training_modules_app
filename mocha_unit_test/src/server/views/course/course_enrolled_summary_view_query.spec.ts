import {expect} from 'chai';
import MockDate from 'mockdate';
import {toDbTimestampFormat} from "@server/repository";
import {createCourse, createUser, STUB_COURSE} from "@mocha-root/test_util/test_course_util";
import {userProgressHandler} from "@server/config/handler_config";
import {courseEnrolledSummaryViewQuery, courseEnrolledUserViewQuery} from "@server/views/view_query_config";
import {CourseEnrolledSummaryView} from "@shared/course_progress_summary";

const DEFAULT_PROPERTIES = {
    version: 0,
    modules: [],
    viewedContentIds: {},
    submittedQuestionIds: {},
    completedQuestionIds: {},
    contentViewed: null,
    lastViewedAt: null,
    questionsCompleted: null,
    courseCompleted: null,
};

describe('Course Enrolled Summary View Query', function () {
    const nowDate = new Date();
    const now = toDbTimestampFormat(nowDate);
    beforeEach(function () {
        MockDate.set(nowDate);
    });

    after(function () {
        MockDate.reset();
    });
    it('should load the course progress summary view of two enrolled users', async function () {
        let admin = await createUser();
        let {courseId} = await createCourse({userId: admin.id, ...STUB_COURSE});
        let enrolled1 = await createUser();
        await userProgressHandler.enrollUserInCourse({userId: enrolled1.id, courseId});

        MockDate.reset();
        let now2Date = new Date();
        let now2 = toDbTimestampFormat(now2Date);
        MockDate.set(now2);

        let enrolled2 = await createUser();
        await userProgressHandler.enrollUserInCourse({userId: enrolled2.id, courseId});

        expect(await courseEnrolledUserViewQuery.searchView({
            id: courseId,
            orderBy: [{colName: "created_at", dir: 'desc'}]
        })).to.deep.eq([
            {
                ...DEFAULT_PROPERTIES,
                id: courseId,
                userId: enrolled2.id,
                username: enrolled2.username,
                createdAt: now2,
                lastModifiedAt: now2,
            },
            {
                ...DEFAULT_PROPERTIES,
                id: courseId,
                userId: enrolled1.id,
                username: enrolled1.username,
                createdAt: now,
                lastModifiedAt: now,
            }
        ]);
        expect(await courseEnrolledSummaryViewQuery.searchView({id: courseId})).to.deep.eq(<CourseEnrolledSummaryView>{
            id: courseId,
            totalEnrolled: 2,
            totalCompleted: 0
        });
    });

});