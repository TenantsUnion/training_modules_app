import {IUserHandler, userHandler} from "../user/user_handler";
import {coursesRepository, ICoursesRepository} from "./courses_repository";
import {ICourseInfo} from "courses";
import {CourseEntity, CourseUsersEntity, UserCoursesEntity} from "./courses";


export interface ICoursesHandler {
    createCourse(courseInfo: ICourseInfo): Promise<string | null>;

    getUserCourses(userId: string): Promise<UserCoursesEntity | string>;

    getCourseUsers(courseId: string): Promise<CourseUsersEntity | string>;
}

export class CoursesHandler implements ICoursesHandler {
    constructor (private coursesRepository: ICoursesRepository,
                 private userHandler: IUserHandler) {
    }

    async createCourse (courseInfo: ICourseInfo): Promise<null | string> {
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
                    let courseEntity: CourseEntity = await this.coursesRepository.loadCourse(courseId);
                    await this.userHandler.userCreatedCourse(courseInfo.createdBy, courseEntity);
                    resolve(null);
                } catch (e) {
                    console.log(e.stack);
                    reject(e);
                }
            })();
        });
    }

    async getCourseUsers (courseId: string): Promise<CourseUsersEntity | string> {
        return new Promise<CourseUsersEntity | string>((resolve, reject) => {

        });
    }

    async getUserCourses (userId: string): Promise<UserCoursesEntity | string> {
        return new Promise<UserCoursesEntity>((resolve, reject) => {
            (async () => {
                try {
                    let courses: UserCoursesEntity = await this.coursesRepository.loadUserCourses(userId);
                    resolve(courses);
                } catch (e) {
                    console.log(e.stack);
                    reject(e);
                }
            })();
        })
    }
}

export const coursesHandler = new CoursesHandler(coursesRepository, userHandler);
