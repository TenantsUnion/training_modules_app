import {createUser, EMPTY_CONTENT_QUESTIONS_DELTA} from "../../../test_util/test_course_util";
import {coursesHandler} from "@server/config/handler_config";

describe('User Courses Listing View Query', function () {
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
            description: 'course 2 description'
        };
        await coursesHandler.createCourse({
                ...course1,
                ...defaultProps
        });
    });
});