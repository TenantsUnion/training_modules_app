import {IUserHandler, userHandler} from "../user/user_handler";
import {coursesRepository, ICoursesRepository} from "./courses_repository";
import {
    AdminCourseDescription, CourseData,
    CourseUserDescription, EnrolledCourseDescription
} from "courses";


export interface ICoursesHandler {
    createCourse(courseInfo: CourseData): Promise<string>;

    getUserEnrolledCourses(username: string): Promise<AdminCourseDescription[]>;

    getUserAdminCourses(username: string): Promise<AdminCourseDescription[]>;

    getCourseUsers(courseId: string): Promise<CourseUserDescription[]>;
}

export class CoursesHandler implements ICoursesHandler {

    constructor (private coursesRepository: ICoursesRepository,
                 private userHandler: IUserHandler) {
    }

    async createCourse (courseInfo: CourseData): Promise<null | string> {
        return new Promise<null | string>((resolve, reject) => {
            if (!courseInfo.title) {
                return resolve('Title required for course');
            } //todo other validation

            (async () => {
                try {
                    let courseExists = await this.coursesRepository.courseExists(courseInfo);
                    if (courseExists) {
                        return resolve(`Courses with title: ${courseInfo.title} already exists`);
                    }
                    let courseId = await this.coursesRepository.createCourse(courseInfo);
                    await this.userHandler.userCreatedCourse(courseInfo.createdBy, courseId);
                    resolve(null);
                } catch (e) {
                    console.log(e.stack);
                    reject(e);
                }
            })();
        });
    }

    async getCourseUsers (courseId: string): Promise<CourseUserDescription[]> {
        return new Promise<CourseUserDescription[]>((resolve, reject) => {

        });
    }

    async getUserEnrolledCourses (username: string): Promise<AdminCourseDescription[]> {
        return new Promise<AdminCourseDescription[]>((resolve, reject) => {
            (async () => {
                try {
                    let courses: EnrolledCourseDescription[]
                        = await this.coursesRepository.loadUserEnrolledCourses(username);
                    resolve(courses);
                } catch (e) {
                    console.log(e.stack);
                    reject(e);
                }
            })();
        })
    }

    async getUserAdminCourses (username: string): Promise<AdminCourseDescription[]> {
        return new Promise<AdminCourseDescription[]>((resolve, reject) => {
            (async () => {
                try {
                    let courses:AdminCourseDescription[] =
                        await this.coursesRepository.loadUserAdminCourses(username);
                    resolve(courses)
                } catch (e) {
                    console.log(e.stack);
                    reject(e);
                }
            })();
        });

    }
}

export const coursesHandler = new CoursesHandler(coursesRepository, userHandler);
