import {Selector} from 'testcafe';
import {landingPage} from "../util/uri_utils";
import {LandingPageDriver} from "../util/drivers/pages/landing_page_driver";
import {LoggedInNavigationDriver} from "../util/drivers/pages/logged_in_navigation_driver";
import {AdminCoursesPageDriver} from "../util/drivers/pages/admin_courses_page_driver";
import {CreateCoursePageDriver} from "../util/drivers/pages/create_course_page_driver";
import {appendUUID} from "../../../test_shared/uuid_generator";

fixture('Admin Course').page(landingPage);

test('should create course', async (t) => {
    let username = appendUUID('test_admin');
    let title = 'course title';
    let description = 'course description';
    let hours = 3;
    let minutes = 30;
    await new LandingPageDriver().signup(username);
    await new LoggedInNavigationDriver().navigateToAdminCourses();
    await new AdminCoursesPageDriver().goToCreateCourse();

    await new CreateCoursePageDriver().createCourse({
        title, description, hours, minutes
    });
    await t.expect(Selector('.welcome-message').innerText).eql(`Welcome, ${username}!`);
});

