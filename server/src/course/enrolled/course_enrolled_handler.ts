import {getLogger} from "../../log";

export interface LoadAdminCourseParameters {
    username: string;
    courseTitle: string;
    courseId: string;
}

export class EnrolledCourseHandler {
    logger = getLogger('CourseHandler', 'info');

    constructor() {
    }

    enrollInCourse(){}

    saveCourseProgress(){}
}
