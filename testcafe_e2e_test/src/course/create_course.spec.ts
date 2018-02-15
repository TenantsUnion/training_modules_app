import {Selector} from 'testcafe';
import {landingPage} from "../util/uri_utils";
import {LandingPageDriver} from "../util/drivers/pages/landing_page_driver";
import {clearData} from "@mochatest/src/test_db_util";
import {LoggedInNavigationDriver} from "../util/drivers/pages/logged_in_navigation_driver";
import {AdminCoursesPageDriver} from "../util/drivers/pages/admin_courses_page_driver";
import {CreateCoursePageDriver} from "../util/drivers/pages/create_course_page_driver";

fixture('Admin Course').page(landingPage)
    .before(async () => {
        await clearData();
    });

test('should create course', async (t) => {
    let username = 'test_admin';
    let title = 'course title';
    let description = 'course description';
    let timeEstimateHours = 3;
    let timeEstimateMinutes = 30;
    await new LandingPageDriver().signup(username);
    await new LoggedInNavigationDriver().navigateToAdminCourses();
    await new AdminCoursesPageDriver().goToCreateCourse();

    let createCourseDriver = new CreateCoursePageDriver();
    await createCourseDriver.setTitle(title);
    await createCourseDriver.setDescription(description);
    await createCourseDriver.setActive(true);
    await createCourseDriver.setTime(timeEstimateHours, timeEstimateMinutes);
    await createCourseDriver.createAndEdit()
        .expect(Selector('.welcome-message').innerText).eql(`Welcome, ${username}!`);
});

