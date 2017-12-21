import * as _ from "underscore";
import {IUserHandler} from "../user/user_handler";
import {CoursesRepository} from "./courses_repository";
import {getLogger} from '../log';
import {CreateModuleEntityCommand, CreateModuleResponse, SaveModuleData} from "../../../shared/modules";
import {
    CreateSectionEntityPayload, CreateSectionResponse, SaveSectionEntityPayload, SaveSectionResponse,
    ViewSectionTransferData
} from '../../../shared/sections';
import {SectionHandler} from '../section/section_handler';
import {QuillRepository} from '../quill/quill_repository';
import {ModuleRepository} from '../module/module_repository';
import {quillRepository} from '../config/repository_config';
import {isQuillEditorData, QuillEditorData} from '../../../shared/quill_editor';
import {
    CreateCourseEntityCommand, CreateCourseEntityPayload, SaveCourseEntityPayload, SaveCourseResponse,
    ViewCourseTransferData
} from '../../../shared/courses';
import {CoursesQueryService} from './courses_query_service';
import {QuillHandler} from '../quill/quill_handler';
import {applyDeltaDiff} from '../../../shared/delta/apply_delta';
import {updateArrOpsValues} from '../../../shared/delta/diff_key_array';

export interface LoadAdminCourseParameters {
    username: string;
    courseTitle: string;
    courseId: string;
}

export class CoursesHandler {
    logger = getLogger('CourseHandler', 'info');

    constructor(private coursesRepository: CoursesRepository,
                private quillHandler: QuillHandler,
                private quillRepository: QuillRepository,
                private userHandler: IUserHandler,
                private moduleRepo: ModuleRepository,
                private sectionHandler: SectionHandler,
                private courseQueryService: CoursesQueryService) {
    }

    async createCourse(createCourseCommand: CreateCourseEntityCommand): Promise<ViewCourseTransferData> {
        try {
            let {userId} = createCourseCommand.metadata;
            let courseInfo: CreateCourseEntityPayload = createCourseCommand.payload;
            let quillContent: QuillEditorData[] = courseInfo.orderedContentQuestions
                .map((el) => isQuillEditorData(el) && el);
            this.logger.log('trace', `Content and questions: ${JSON.stringify(quillContent, null, 2)}`);

            // create quill content
            let quillIds = await this.quillRepository.getNextIds(quillContent.length);
            this.logger.info(`Using quill ids ${JSON.stringify(quillIds, null, 2)}`);
            let insertContentAsync = quillContent.map((content, index) => {
                return quillRepository.insertEditorJson(quillIds[index], content.editorJson);
            });

            await insertContentAsync;
            let courseId = await this.coursesRepository.createCourse(courseInfo, quillIds);
            await this.userHandler.userCreatedCourse(userId, courseId);
            this.logger.info(`Successfully created course: ${courseId}`);
            let course = await this.coursesRepository.loadAdminCourse(courseId);

            return course;
        } catch (e) {
            this.logger.error('Exception creating course\n%s', e);
            throw e;
        }
    }

    async createModule(createModuleCommand: CreateModuleEntityCommand): Promise<CreateModuleResponse> {
        let metadata = createModuleCommand.metadata;
        let payload = createModuleCommand.payload;
        try {

            // let moduleHeaderQuillId = await this.quillRepository.getNextId();
            // await this.quillRepository.insertEditorJson(moduleHeaderQuillId, createModuleCommand);
            let quillIds = await this.quillHandler.createTrainingEntityContent(payload.orderedContentQuestions);
            let moduleId = await this.moduleRepo.addModule(payload, quillIds);
            let addCoursesModule = this.coursesRepository.addModule(payload.courseId, moduleId);
            let updateLastActive = this.coursesRepository.updateLastModified(payload.courseId);
            await Promise.all([addCoursesModule, updateLastActive]);
            this.logger.info('Adding module to course finished');

            let loadedCourse = await this.coursesRepository.loadAdminCourse(payload.courseId);
            return {
                moduleId,
                course: loadedCourse
            };
        } catch (e) {
            this.logger.log('error', 'Failed to add module to course %s', payload.courseId);
            throw e;
        }
    }

    async saveModule(moduleData: SaveModuleData): Promise<ViewCourseTransferData> {
        let course = await this.coursesRepository.loadAdminCourse(moduleData.courseId);
        let sectionsRemoved = _.extend({}, moduleData, {
            orderedSectionIds: moduleData.orderedSectionIds.filter((sectionId) => {
                return moduleData.removeSectionIds.indexOf(sectionId) === -1;
            })
        });
        await Promise.all([
            this.coursesRepository.updateLastModified(moduleData.courseId),
            this.moduleRepo.saveModule(sectionsRemoved),
            this.moduleRepo.updateLastModified(moduleData.id),
            // this.quillRepository.updateEditorJson(moduleData.headerContentId, moduleData.headerContent),
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

        return this.coursesRepository.loadAdminCourse(moduleData.courseId);
    }

    async saveSection(sectionData: SaveSectionEntityPayload): Promise<SaveSectionResponse> {
        let {id, moduleId, courseId} = sectionData;
        try {
            await this.coursesRepository.updateLastModified(courseId);
            await this.moduleRepo.updateLastModified(moduleId);
            await this.sectionHandler.saveSection(sectionData);

            let course = await this.coursesRepository.loadAdminCourse(courseId);
            return {
                sectionId: id,
                moduleId, course
            };
        } catch (e) {
            this.logger.error(e);
            this.logger.error(e.stack);
            throw e;
        }
    }

    async createSection(sectionData: CreateSectionEntityPayload): Promise<CreateSectionResponse> {
        let sectionId = await this.sectionHandler.createSection(sectionData);
        this.logger.info('Created new section with id: %s', sectionId);
        await this.coursesRepository.updateLastModified(sectionData.courseId);
        this.logger.info('Updated course last modified: %s', sectionData.courseId);

        await this.moduleRepo.addSection(sectionData.moduleId, sectionId);
        this.logger.info('Added section to module: %s', sectionData.moduleId);

        let loadedCourse = await this.coursesRepository.loadAdminCourse(sectionData.courseId);
        return {
            sectionId,
            course: loadedCourse
        };
    }

    async saveCourse(saveCourse: SaveCourseEntityPayload): Promise<SaveCourseResponse> {
        let {id, changes, changes: {changeQuillContent, orderedContentIds}} = saveCourse;
        let quillIdMap = await this.quillHandler.handleQuillChanges(changeQuillContent);

        let course: ViewCourseTransferData = await this.coursesRepository.loadAdminCourse(id);
        let updatedCourse = applyDeltaDiff(course, {
            ...changes, orderedContentIds: updateArrOpsValues(orderedContentIds, quillIdMap)
        });

        await this.coursesRepository.saveCourse(updatedCourse);
        return {
            course: await this.coursesRepository.loadAdminCourse(id)
        };
    }
}

