import {getLogger} from "../../log";
import {UserRepository} from "../../user/users_repository";
import {CourseProgressRepository} from "@course/enrolled/course_progress_repository";

export interface LoadAdminCourseParameters {
    username: string;
    courseTitle: string;
    courseId: string;
}

export class EnrolledCourseHandler {
    logger = getLogger('CourseHandler', 'info');

    constructor(private userRepo: UserRepository,
                private courseProgressRepo: CourseProgressRepository) {
    }

    async enrollInCourse(enrollInfo: {courseId: string, userId: string}){
        await this.userRepo.addEnrolledCoursesId(enrollInfo);
        await this.courseProgressRepo.createCourseProgress(enrollInfo);
    }

    saveCourseProgress(){}
}
