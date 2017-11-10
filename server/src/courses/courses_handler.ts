import * as _ from "underscore";
import {IUserHandler} from "../user/user_handler";
import {ICoursesRepository} from "./courses_repository";
import {
    AdminCourseDescription, CreateCourseData,
    EnrolledCourseDescription, SaveCourseEntityCommand, ViewCourseTransferData
} from "courses";
import {getLogger} from '../log';
import {CreateModuleData, SaveModuleData} from "../../../shared/modules";
import {CreateSectionData, SaveSectionData, ViewSectionTransferData} from '../../../shared/sections';
import {SectionHandler} from '../section/section_handler';
import {QuillRepository} from '../quill/quill_repository';
import {ModuleRepository} from '../module/module_repository';
import {ContentSegment, isContentSegment} from '../../../shared/segment';
import {quillRepository} from '../config/repository.config';
import * as content from '../../../shared/content';

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
                private quillRepository: QuillRepository,
                private userHandler: IUserHandler,
                private moduleRepo: ModuleRepository,
                private sectionHandler: SectionHandler) {
    }

    async createCourse(courseInfo: CreateCourseData): Promise<string> {
        try {
            let contentSegments: ContentSegment[] = <ContentSegment[]> courseInfo.segments
                .filter((el) => isContentSegment(el));
            this.logger.info(`Content segments: ${JSON.stringify(contentSegments, null, 2)}`);

            // create quill content
            let quillIds = await this.quillRepository.getNextIds(contentSegments.length);
            this.logger.info(`Using quill ids ${JSON.stringify(quillIds, null, 2)}`);
            let insertContent = contentSegments.map((content, index) => {
                return quillRepository.insertEditorJson(quillIds[index], content.editorJson);
            });

            await insertContent;
            let courseId = await this.coursesRepository.createCourse(courseInfo, quillIds);
            await this.userHandler.userCreatedCourse(courseInfo.createdBy, courseId);
            return courseId;
        } catch (e) {
            this.logger.error('Exception creating course\n%s', e);
            throw e;
        }
    }

    async createModule(createModuleData: CreateModuleData): Promise<ViewCourseTransferData> {
        return new Promise<ViewCourseTransferData>((resolve, reject) => {
            (async () => {
                try {
                    let moduleHeaderQuillId = await this.quillRepository.getNextId();
                    // await this.quillRepository.insertEditorJson(moduleHeaderQuillId, createModuleData);

                    let moduleId = await this.moduleRepo.addModule(createModuleData, moduleHeaderQuillId);
                    let addCoursesModule = this.coursesRepository.addModule(createModuleData.courseId, moduleId);
                    let updateLastActive = this.coursesRepository.updateLastModified(createModuleData.courseId);
                    await Promise.all([addCoursesModule, updateLastActive]);
                    this.logger.info('Adding module to course finished');

                    let loadedCourse = await this.coursesRepository.loadUserAdminCourse(createModuleData.courseId);
                    resolve(loadedCourse);
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

    async saveModule(moduleData: SaveModuleData): Promise<ViewCourseTransferData> {
        let course = await this.coursesRepository.loadUserAdminCourse(moduleData.courseId);
        let sectionsRemoved = _.extend({}, moduleData, {
            orderedSectionIds: moduleData.orderedSectionIds.filter((sectionId) => {
                return moduleData.removeSectionIds.indexOf(sectionId) === -1;
            })
        });
        await Promise.all([
            this.coursesRepository.updateLastModified(moduleData.courseId),
            this.moduleRepo.saveModule(sectionsRemoved),
            this.moduleRepo.updateLastModified(moduleData.id),
            this.quillRepository.updateEditorJson(moduleData.headerContentId, moduleData.headerContent),
        ]);

        //remove sections from module

        let sectionLookup: { [index: string]: ViewSectionTransferData } = _.find(course.modules, (module) => {
            return module.id === moduleData.id;
        })
            .sections.reduce((acc, section) => {
                acc[section.id] = section;
                return acc;
            }, {});

        let asyncRemoveSections = _.chain(moduleData.removeSectionIds)
            .map((sectionId) => {
                return sectionLookup[sectionId];
            })
            .map((section) => {
                return this.sectionHandler.removeSection(section);
            }).value();
        await Promise.all(asyncRemoveSections);

        this.logger.log('info', 'saved module id: %s, title: %s', moduleData.id, moduleData.title);

        return this.coursesRepository.loadUserAdminCourse(moduleData.courseId);
    }

    async saveSection(sectionData: SaveSectionData): Promise<ViewCourseTransferData> {
        try {
            await this.coursesRepository.updateLastModified(sectionData.courseId);
            await this.moduleRepo.updateLastModified(sectionData.moduleId);
            await this.sectionHandler.saveSection(sectionData);

            return this.coursesRepository.loadUserAdminCourse(sectionData.courseId);
        } catch (e) {
            this.logger.error(e);
            this.logger.error(e.stack);
            throw e;
        }
    }

    async createSection(sectionData: CreateSectionData): Promise<ViewCourseTransferData> {
        try {
            let sectionId = await this.sectionHandler.createSection(sectionData);
            this.logger.info('Create new section with id: %s', sectionId);
            await this.coursesRepository.updateLastModified(sectionData.courseId);
            this.logger.info('Updated course last modified: %s', sectionData.courseId);

            await this.moduleRepo.addSection(sectionData.moduleId, sectionId);
            this.logger.info('Added section to module: %s', sectionData.moduleId);

            return await this.coursesRepository.loadUserAdminCourse(sectionData.courseId);
        } catch (e) {
            this.logger.error(e);
            this.logger.error(e.stack);
            throw e;
        }
    }

    saveCourse(saveCourse: SaveCourseEntityCommand): Promise<ViewCourseTransferData> {
        return new Promise<ViewCourseTransferData>((resolve, reject) => {
            (async () => {
                try {

                    await this.coursesRepository.saveCourse(saveCourse);
                    let course = await this.coursesRepository.loadUserAdminCourse(saveCourse.id);

                    resolve(course);
                } catch (e) {
                    this.logger.error(e);
                    this.logger.error(e.stack);
                    reject(e);
                }
            })();
        });
    }
}

