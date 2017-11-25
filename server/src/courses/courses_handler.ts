import * as _ from "underscore";
import {IUserHandler} from "../user/user_handler";
import {ICoursesRepository} from "./courses_repository";
import {getLogger} from '../log';
import {CreateModuleEntityCommand, SaveModuleData} from "../../../shared/modules";
import {CreateSectionData, SaveSectionData, ViewSectionTransferData} from '../../../shared/sections';
import {SectionHandler} from '../section/section_handler';
import {QuillRepository} from '../quill/quill_repository';
import {ModuleRepository} from '../module/module_repository';
import {quillRepository} from '../config/repository_config';
import {isQuillEditorData, QuillEditorData} from '../../../shared/quill_editor';
import {
    CreateCourseEntityCommand, CreateCourseEntityPayload, SaveCourseEntityCommand, ViewCourseTransferData
} from '../../../shared/courses';

export interface LoadAdminCourseParameters {
    username: string;
    courseTitle: string;
    courseId: string;
}

export const isUsernameCourseTitle = function (obj): obj is LoadAdminCourseParameters {
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

    async createCourse(createCourseCommand: CreateCourseEntityCommand): Promise<string> {
        try {
            let metadata = createCourseCommand.metadata;
            let courseInfo: CreateCourseEntityPayload = createCourseCommand.payload;
            let contentQuestions: QuillEditorData[] = courseInfo.orderedContentQuestions
                .map((el) => isQuillEditorData(el) && el);
            this.logger.info(`Content and questions: ${JSON.stringify(contentQuestions, null, 2)}`);

            // create quill content
            let quillIds = await this.quillRepository.getNextIds(contentQuestions.length);
            this.logger.info(`Using quill ids ${JSON.stringify(quillIds, null, 2)}`);
            let insertContent = contentQuestions.map((content, index) => {
                return quillRepository.insertEditorJson(quillIds[index], content.editorJson);
            });

            await insertContent;
            let courseId = await this.coursesRepository.createCourse(courseInfo, quillIds);
            await this.userHandler.userCreatedCourse(metadata.userId, courseId);
            this.logger.info(`Successfully created course: ${courseId}`);
            return courseId;
        } catch (e) {
            this.logger.error('Exception creating course\n%s', e);
            throw e;
        }
    }

    async createModule(createModuleCommand: CreateModuleEntityCommand): Promise<ViewCourseTransferData> {
        let metadata = createModuleCommand.metadata;
        let payload = createModuleCommand.payload;
        try {

            let moduleHeaderQuillId = await this.quillRepository.getNextId();
            // await this.quillRepository.insertEditorJson(moduleHeaderQuillId, createModuleCommand);

            let moduleId = await this.moduleRepo.addModule(payload, moduleHeaderQuillId);
            let addCoursesModule = this.coursesRepository.addModule(payload.courseId, moduleId);
            let updateLastActive = this.coursesRepository.updateLastModified(payload.courseId);
            await Promise.all([addCoursesModule, updateLastActive]);
            this.logger.info('Adding module to course finished');

            let loadedCourse = await this.coursesRepository.loadUserAdminCourse(payload.courseId);
            return loadedCourse;
        } catch (e) {
            this.logger.log('error', 'Failed to add module to course %s', payload.courseId);
            throw e;
        }
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

    async saveCourse(saveCourse: SaveCourseEntityCommand): Promise<ViewCourseTransferData> {
        try {
            await this.coursesRepository.saveCourse(saveCourse);
            return await this.coursesRepository.loadUserAdminCourse(saveCourse.metadata.id);
        } catch (e) {
            this.logger.error(e);
            this.logger.error(e.stack);
            throw e;
        }
    }
}

