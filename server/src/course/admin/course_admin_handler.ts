import {IUserHandler} from "../../user/user_handler";
import {getLogger} from '../../log';
import {CreateModuleEntityPayload, CreateModuleIdMap, SaveModuleEntityPayload} from "@shared/modules";
import {
    CreateSectionEntityPayload, SaveSectionEntityPayload, SectionIdMap
} from '@shared/sections';
import {
    CourseEntity, CreateCourseEntityPayload, CreateCourseIdMap, SaveCourseEntityPayload
} from '@shared/courses';
import {QuillHandler} from '../../training_entity/quill/quill_handler';
import {applyDeltaDiff} from '@shared/delta/apply_delta';
import {TrainingEntityHandler} from '../../training_entity/admin/training_entity_handler';
import {ContentQuestionEntity} from '@shared/training_entity';
import {applyDeltaArrOps, updateArrOpsValues} from '@shared/delta/diff_key_array';
import {CourseRepository} from "./course_repository";
import {AdminModuleHandler} from "@module/admin/admin_module_handler";
import {AdminSectionHandler} from "@section/admin/admin_section_handler";

export class AdminCourseHandler {
    logger = getLogger('CourseHandler', 'info');

    constructor(private courseRepository: CourseRepository,
                private quillHandler: QuillHandler,
                private trainingEntityHandler: TrainingEntityHandler,
                private userHandler: IUserHandler,
                private sectionHandler: AdminSectionHandler,
                private moduleHandler: AdminModuleHandler) {
    }

    async createCourse(createCoursePayload: CreateCourseEntityPayload): Promise<CreateCourseIdMap> {
        try {
            let {contentQuestions: {orderedContentIds, orderedQuestionIds, orderedContentQuestionIds}, userId} = createCoursePayload;
            let placeholderIdMap =
                await this.trainingEntityHandler.handleContentQuestionDelta(createCoursePayload.contentQuestions);

            let contentQuestions: ContentQuestionEntity = {
                orderedContentIds: applyDeltaArrOps([], updateArrOpsValues(orderedContentIds, placeholderIdMap)),
                orderedQuestionIds: applyDeltaArrOps([], updateArrOpsValues(orderedQuestionIds, placeholderIdMap)),
                orderedContentQuestionIds: applyDeltaArrOps([], updateArrOpsValues(orderedContentQuestionIds, placeholderIdMap))
            };

            let courseId = await this.courseRepository.createCourse({...createCoursePayload, ...contentQuestions});
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

        let course: CourseEntity = await this.courseRepository.loadCourseEntity(id);
        let updatedCourse = applyDeltaDiff(course, {
            ...changes,
            orderedContentIds: updateArrOpsValues(orderedContentIds, placeholderIdMap),
            orderedQuestionIds: updateArrOpsValues(orderedQuestionIds, placeholderIdMap),
            orderedContentQuestionIds: updateArrOpsValues(orderedContentQuestionIds, placeholderIdMap)
        });

        await this.courseRepository.saveCourse(updatedCourse);
    }

    async createModule(createModuleCommand: CreateModuleEntityPayload): Promise<CreateModuleIdMap> {
        const {courseId} = createModuleCommand;
        try {

            let placeholderIdMap = await this.moduleHandler.createModule(createModuleCommand);
            let addCourseModule = this.courseRepository.addModule(courseId, placeholderIdMap.moduleId);
            let updateLastActive = this.courseRepository.updateLastModified(courseId);
            await Promise.all([addCourseModule, updateLastActive]);
            this.logger.info('Adding module to course finished');

            return placeholderIdMap;
        } catch (e) {
            this.logger.log('error', 'Failed to add module to course %s', courseId);
            throw e;
        }
    }

    async saveModule(moduleData: SaveModuleEntityPayload): Promise<void> {
        await this.courseRepository.updateLastModified(moduleData.courseId);
        await this.moduleHandler.saveModule(moduleData);
    }

    async saveSection(sectionData: SaveSectionEntityPayload): Promise<void> {
        try {
            await this.courseRepository.updateLastModified(sectionData.courseId);
            await this.moduleHandler.saveSection(sectionData);
            await this.sectionHandler.saveSection(sectionData);
        } catch (e) {
            this.logger.error(e);
            this.logger.error(e.stack);
            throw e;
        }
    }

    async createSection(sectionData: CreateSectionEntityPayload): Promise<SectionIdMap> {
        let sectionPlaceholderIdMap = await this.sectionHandler.createSection(sectionData);
        let {sectionId} = sectionPlaceholderIdMap;
        await this.courseRepository.updateLastModified(sectionData.courseId);

        await this.moduleHandler.addSection({sectionId, ...sectionData});
        return sectionPlaceholderIdMap;
    }
}

