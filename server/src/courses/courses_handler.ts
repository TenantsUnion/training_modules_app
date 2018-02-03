import {IUserHandler} from "../user/user_handler";
import {CoursesRepository} from "./courses_repository";
import {getLogger} from '../log';
import {CreateModuleEntityPayload, SaveModuleEntityPayload} from "@shared/modules";
import {
    CreateSectionEntityPayload, SaveSectionEntityPayload
} from '@shared/sections';
import {SectionHandler} from './section/section_handler';
import {
    CourseEntity,
    CreateCourseEntityCommand, CreateCourseEntityPayload, CreateCourseIdMap, SaveCourseEntityPayload
} from '@shared/courses';
import {QuillHandler} from '../training_entity/quill/quill_handler';
import {applyDeltaDiff} from '@shared/delta/apply_delta';
import {ModuleHandler} from './module/module_handler';
import {TrainingEntityHandler} from '../training_entity/training_entity_handler';
import {ContentQuestionEntity} from '@shared/training_entity';
import {applyDeltaArrOps, updateArrOpsValues} from '@shared/delta/diff_key_array';

export interface LoadAdminCourseParameters {
    username: string;
    courseTitle: string;
    courseId: string;
}

export class CoursesHandler {
    logger = getLogger('CourseHandler', 'info');

    constructor(private coursesRepository: CoursesRepository,
                private quillHandler: QuillHandler,
                private trainingEntityHandler: TrainingEntityHandler,
                private userHandler: IUserHandler,
                private sectionHandler: SectionHandler,
                private moduleHandler: ModuleHandler) {
    }

    async createCourse(createCourseCommand: CreateCourseEntityCommand): Promise<CreateCourseIdMap> {
        try {
            let {userId} = createCourseCommand.metadata;
            let courseInfo: CreateCourseEntityPayload = createCourseCommand.payload;
            // create quill content
            let {contentQuestions: {orderedContentIds, orderedQuestionIds, orderedContentQuestionIds}} = courseInfo;
            let placeholderIdMap =
                await this.trainingEntityHandler.handleContentQuestionDelta(courseInfo.contentQuestions);

            let contentQuestions: ContentQuestionEntity = {
                orderedContentIds: applyDeltaArrOps([], updateArrOpsValues(orderedContentIds, placeholderIdMap)),
                orderedQuestionIds: applyDeltaArrOps([], updateArrOpsValues(orderedQuestionIds, placeholderIdMap)),
                orderedContentQuestionIds: applyDeltaArrOps([], updateArrOpsValues(orderedContentQuestionIds, placeholderIdMap))
            };

            let courseId = await this.coursesRepository.createCourse({...courseInfo, ...contentQuestions});
            await this.userHandler.userCreatedCourse(userId, courseId);
            this.logger.info(`Successfully created course: ${courseId}`);

            return {courseId, ...placeholderIdMap};
        } catch (e) {
            this.logger.error('Exception creating course\n%s', e);
            throw e;
        }
    }

    async saveCourse(saveCourse: SaveCourseEntityPayload): Promise<void> {
        let {id, changes} = saveCourse;
        let {orderedContentIds, orderedQuestionIds, orderedContentQuestionIds} = saveCourse.contentQuestions;
        let placeholderIdMap = await this.trainingEntityHandler.handleContentQuestionDelta(saveCourse.contentQuestions);

        let course: CourseEntity = await this.coursesRepository.loadCourseEntity(id);
        let updatedCourse = applyDeltaDiff(course, {
            ...changes,
            orderedContentIds: updateArrOpsValues(orderedContentIds, placeholderIdMap),
            orderedQuestionIds: updateArrOpsValues(orderedQuestionIds, placeholderIdMap),
            orderedContentQuestionIds: updateArrOpsValues(orderedContentQuestionIds, placeholderIdMap)
        });

        await this.coursesRepository.saveCourse(updatedCourse);
    }

    async createModule(createModuleCommand: CreateModuleEntityPayload): Promise<string> {
        const {courseId} = createModuleCommand;
        try {

            let moduleId = await this.moduleHandler.createModule(createModuleCommand);
            let addCoursesModule = this.coursesRepository.addModule(courseId, moduleId);
            let updateLastActive = this.coursesRepository.updateLastModified(courseId);
            await Promise.all([addCoursesModule, updateLastActive]);
            this.logger.info('Adding module to course finished');

            return moduleId;
        } catch (e) {
            this.logger.log('error', 'Failed to add module to course %s', courseId);
            throw e;
        }
    }

    async saveModule(moduleData: SaveModuleEntityPayload): Promise<void> {
        await this.coursesRepository.updateLastModified(moduleData.courseId);
        await this.moduleHandler.saveModule(moduleData);
    }

    async saveSection(sectionData: SaveSectionEntityPayload): Promise<void> {
        try {
            await this.coursesRepository.updateLastModified(sectionData.courseId);
            await this.moduleHandler.saveModule(sectionData);
            await this.sectionHandler.saveSection(sectionData);
        } catch (e) {
            this.logger.error(e);
            this.logger.error(e.stack);
            throw e;
        }
    }

    async createSection(sectionData: CreateSectionEntityPayload): Promise<string> {
        let sectionId = await this.sectionHandler.createSection(sectionData);
        this.logger.info('Created new section with id: %s', sectionId);
        await this.coursesRepository.updateLastModified(sectionData.courseId);
        this.logger.info('Updated course last modified: %s', sectionData.courseId);

        await this.moduleHandler.addSection({sectionId, ...sectionData});
        return sectionId;
    }


}

