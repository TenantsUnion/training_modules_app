import {IUserHandler} from "../user/user_handler";
import {ICoursesRepository} from "./courses_repository";
import {
    AdminCourseDescription, CourseData,
    EnrolledCourseDescription, UserAdminCourseData, UserEnrolledCourseData
} from "courses";
import {getLogger} from '../log';
import {CreateModuleData} from "../../../shared/modules";
import {ModuleRepository} from "../module/module_repository";

export interface UsernameCourseTitle {
    username: string;
    courseTitle: string;
}

export const isUsernameCourseTitle = function (obj): obj is UsernameCourseTitle {
    return typeof obj === 'object'
        && typeof obj.username === 'string'
        && typeof obj.courseTitle === 'string'
};

export interface ICoursesHandler {
    createCourse(courseInfo: CourseData): Promise<string>;

    getUserEnrolledCourses(username: string): Promise<AdminCourseDescription[]>;

    getUserAdminCourses(username: string): Promise<AdminCourseDescription[]>;

    loadAdminCourse(courseId: string | UsernameCourseTitle): Promise<UserAdminCourseData>;

    loadEnrolledCourse(username: string, courseId: string): Promise<UserEnrolledCourseData>;

    createModule(courseId: string, createModuleData: CreateModuleData): void;

}

export class CoursesHandler implements ICoursesHandler {
    logger = getLogger('CourseHandler', 'info');

    constructor (private coursesRepository: ICoursesRepository,
                 private userHandler: IUserHandler,
                 private modulesRepository: ModuleRepository) {
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
                    this.logger.error('error',);
                    console.log(e.stack);
                    reject(e);
                }
            })();
        });
    }

    async createModule (courseId: string, createModuleData: CreateModuleData): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            (async () => {
                let moduleId = await this.modulesRepository.addModule(createModuleData);
                await this.coursesRepository.addModule(courseId, moduleId);
            })();
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
                    let courses: AdminCourseDescription[] =
                        await this.coursesRepository.loadUserAdminCourses(username);
                    resolve(courses)
                } catch (e) {
                    console.log(e.stack);
                    reject(e);
                }
            })();
        });

    }

    async loadAdminCourse (courseId: string | UsernameCourseTitle): Promise<UserAdminCourseData> {
        return new Promise<UserAdminCourseData>((resolve, reject) => {
            (async () => {
                try {
                    let adminCourse = await this.coursesRepository.loadUserAdminCourse(courseId);
                    resolve(adminCourse);
                } catch (e) {
                    this.logger.error(e);
                    this.logger.error(e.stack);
                    reject(e);
                }
            })();
        });
    }

    async loadEnrolledCourse (username: string, courseId: string): Promise<UserEnrolledCourseData> {
        return new Promise<UserEnrolledCourseData>((resolve, reject) => {
            (async () => {
                try {
                    let enrolledCourse = await this.coursesRepository.loadUserEnrolledCourse(username, courseId);
                    resolve(enrolledCourse)
                } catch (e) {
                    this.logger.error(e);
                    this.logger.error(e.stack);
                    reject(e);
                }
            })();
        });
    }
}

