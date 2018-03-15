import {expect} from 'chai';
import {createCourse, createUser, STUB_COURSE} from "../util/test_course_util";
import {userProgressHandler} from "@server/config/handler_config";
import {courseProgressSummaryViewQuery} from "@server/config/query_service_config";

describe('Course Progress Summary View Query', function () {
    it('should load the course progress summary view of two enrolled users', async function () {
        let admin = await createUser();
        let {courseId} = await createCourse({userId: admin.id, ...STUB_COURSE});
        let enrolled1 = await createUser();
        let enrolled2 = await createUser();
        await userProgressHandler.enrollUserInCourse({userId: enrolled1.id, courseId});
        await userProgressHandler.enrollUserInCourse({userId: enrolled2.id, courseId});
        console.log(courseId);
        expect(await courseProgressSummaryViewQuery.load(courseId)).to.deep.eq({});
    });
});