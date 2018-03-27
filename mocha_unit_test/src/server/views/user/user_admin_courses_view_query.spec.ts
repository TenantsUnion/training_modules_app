import {expect} from 'chai';
import {createUser, EMPTY_CONTENT_QUESTIONS_DELTA} from "../../../test_util/test_course_util";
import {coursesHandler} from "@server/config/handler_config";
import {userAdminCoursesViewQuery} from "@server/views/view_query_config";
import MockDate from 'mockdate';
import {toDbTimestampFormat} from "@server/repository";
import {CourseDescription} from "@shared/courses";

describe('User Admin Courses View Query', function () {
    const nowDate = new Date();
    const now = toDbTimestampFormat(nowDate);
    beforeEach(function () {
        MockDate.set(now);
    });

    after(function () {
        MockDate.reset();
    });
    it('should load 2 admin courses for a user', async () => {
        let {id: userId} = await createUser();
        let defaultProps = {
            openEnrollment: true,
            active: true,
            submitIndividually: true,
            contentQuestions: EMPTY_CONTENT_QUESTIONS_DELTA,
            timeEstimate: 0
        };
        let course1 = {
            title: 'course 1 title',
            description: 'course 1 description', userId
        };
        let course2 = {
            title: 'course 2 title',
            description: 'course 2 description', userId
        };
        let {courseId: courseId1} = await coursesHandler.createCourse({
            ...course1,
            ...defaultProps
        });

        MockDate.reset();
        const nowDate2 = new Date();
        MockDate.set(nowDate2);
        const now2 = toDbTimestampFormat(nowDate2);
        const {courseId: courseId2} = await coursesHandler.createCourse({
            ...course2,
            ...defaultProps
        });
        expect(await userAdminCoursesViewQuery.searchView({
            id: userId,
            orderBy: [{colName: "last_modified_at", dir: "desc"}]
        })).to.deep.eq(<CourseDescription[]>[
            {
                id: courseId2,
                title: course2.title,
                description: course2.description,
                timeEstimate: 0,
                lastModifiedAt: now2, createdAt: now2
            },
            {
                id: courseId1,
                title: course1.title,
                description: course1.description,
                timeEstimate: 0,
                lastModifiedAt: now, createdAt: now
            }
        ]);
    });
});