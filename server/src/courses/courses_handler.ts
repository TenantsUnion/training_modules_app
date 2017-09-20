import {IUserHandler} from "../user/user_handler";
import {ICoursesRepository} from "./courses_repository";
import {
    AdminCourseDescription, CourseData, CreateCourseData,
    EnrolledCourseDescription, UserAdminCourseData, UserEnrolledCourseData
} from "courses";
import {getLogger} from '../log';
import {CreateModuleData, ModuleData} from "../../../shared/modules";
import {ModuleRepository} from "../module/module_repository";
import {ModuleHandler} from '../module/module_handler';
import {CreateSectionData, SectionData} from '../../../shared/sections';
import {SectionHandler} from '../section/section_handler';

export interface UsernameCourseTitle {
    username: string;
    courseTitle: string;
}

export const isUsernameCourseTitle = function (obj): obj is UsernameCourseTitle {
    return typeof obj === 'object'
        && typeof obj.username === 'string'
        && typeof obj.courseTitle === 'string'
};

export class CoursesHandler {
    logger = getLogger('CourseHandler', 'info');

    constructor(private coursesRepository: ICoursesRepository,
                private userHandler: IUserHandler,
                private moduleHandler: ModuleHandler,
                private sectionHandler: SectionHandler) {
    }

    async createCourse(courseInfo: CreateCourseData): Promise<string> {
        return new Promise<null | string>((resolve, reject) => {
            if (!courseInfo.title) {
                return resolve('Title required for course');
            } //todo other validation

            (async () => {
                let courseExists = await this.coursesRepository.courseExists(courseInfo);
                if (courseExists) {
                    return reject(`Courses with title: ${courseInfo.title} already exists`);
                }
                let courseId = await this.coursesRepository.createCourse(courseInfo);
                await this.userHandler.userCreatedCourse(courseInfo.createdBy, courseId);
                resolve(courseId);
            })().catch((e) => {
                this.logger.error('Exception creating course\n%s', e);
                return e;
            });
        });
    }

    async createModule(createModuleData: CreateModuleData): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            (async () => {
                try {
                    let updateLastActive = this.coursesRepository.updateLastModified(createModuleData.courseId);
                    let moduleId = await this.moduleHandler.addModule(createModuleData);
                    let addCoursesModule = this.coursesRepository.addModule(createModuleData.courseId, moduleId);

                    await Promise.all([addCoursesModule, updateLastActive])
                        .then(() => {
                            resolve(moduleId);
                        });
                } catch (e) {
                    this.logger.log('error', 'Failed to add module to course %s', createModuleData.courseId);
                    reject(e);
                }
            })();
        });
    }

    async getUserEnrolledCourses(username: string): Promise<AdminCourseDescription[]> {
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

    async getUserAdminCourses(username: string): Promise<AdminCourseDescription[]> {
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

    async saveModule(courseId: string, moduleData: ModuleData): Promise<void> {
        return Promise.all([
            this.coursesRepository.updateLastModified(courseId),
            this.moduleHandler.saveModule(moduleData)
        ]).then(() => {
        }).catch((e) => {
            this.logger.error(e);
            this.logger.error(e.stack);
            throw e;
        });
    }

    async saveSection(courseId, moduleId, sectionData: SectionData): Promise<void> {
        return Promise.all([
            this.coursesRepository.updateLastModified(courseId),
            this.moduleHandler.updateLastModified(moduleId),
            this.sectionHandler.saveSection(sectionData)
        ]).then(() => {

        }).catch((e) => {
            this.logger.error(e);
            this.logger.error(e.stack);
            throw e;
        })
    }

    async createSection(sectionData: CreateSectionData): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            (async () => {
                try {
                    let sectionId = await this.sectionHandler.createSection(sectionData);
                    this.logger.info('Create new section with id: %s', sectionId);
                    await this.coursesRepository.updateLastModified(sectionData.courseId);
                    this.logger.info('Updated course last modified: %s', sectionData.courseId);
                    await this.moduleHandler.addSection(sectionData.moduleId, sectionId);
                    this.logger.info('Added section to module: %s', sectionData.moduleId);

                    resolve(sectionId);
                } catch (e) {
                    this.logger.error(e);
                    this.logger.error(e.stack);
                    reject(e);
                }
            })();
        });
    }
}

