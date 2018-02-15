import {Selector, t} from "testcafe";

export class AdminCoursesPageDriver {
    private createCourseBtn = Selector('.create-course-btn');
    private editCourseBtns = Selector('.edit-course-btn');

    goToCreateCourse(): TestControllerPromise {
        return t.click(this.createCourseBtn);
    }

    editFirstCourse(): TestControllerPromise {
        return t.click(this.editCourseBtns.nth(0))
    }
}