import {t, Selector} from "testcafe";

export class LoggedInNavigationDriver {
    private adminCoursesNav = Selector('.admin-courses-nav');
    private enrolledCoursesNav = Selector('.enrolled-courses-nav');
    private logoutBtn = Selector('.logout-btn');

    navigateToAdminCourses(): TestControllerPromise {
        return t.click(this.adminCoursesNav);
    }

    navigateToEnrolledCourses(): TestControllerPromise {
        return t.click(this.enrolledCoursesNav);
    }

    logout(): TestControllerPromise {
        debugger;
        return t.click(this.logoutBtn);
    }
}
