import {Router, Request} from "express";
import {
    CreateCourseEntityCommand, SaveCourseEntityPayload,
    CreateCourseResponse, SaveCourseResponse
} from "@shared/courses";
import {AdminCourseHandler} from "@server/handlers/course/course_handler";
import {CreateModuleEntityPayload, CreateModuleResponse, SaveModuleEntityPayload} from "@shared/modules";
import {
    CreateSectionEntityPayload, SaveSectionEntityPayload,
    SaveSectionResponse
} from '@shared/sections';
import {AbstractCommandController} from "@server/web/abstract_routes_controller";
import {CourseTrainingViewQuery} from "@server/views/training/course_views_query";
import {ModuleViewQuery} from "@server/views/training/module_training_view_query";
import {SectionViewQuery} from "@server/views/training/section_view_query";
import {CourseStructureViewQuery} from "@server/views/course/course_structure_view_query";
import {UserAdminCoursesViewQuery} from "@server/views/user/user_admin_courses_view_query";
import {getLogger} from "@server/log";
import {coursesHandler} from "@server/config/handler_config";
import {validateCreateCourse, validateSaveCourse} from "@server/handlers/course/course_validation";
import {SaveTrainingResponse} from '@shared/training';

export class CourseCommandController extends AbstractCommandController {
    constructor (private coursesHandler: AdminCourseHandler,
                 private courseViewQuery: CourseTrainingViewQuery,
                 private moduleViewQuery: ModuleViewQuery,
                 private sectionViewQuery: SectionViewQuery,
                 private courseStructureViewQuery: CourseStructureViewQuery,
                 private userAdminCoursesViewQuery: UserAdminCoursesViewQuery) {
        super(getLogger('CoursesController', 'info'))
    }

    async createCourse (request: Request): Promise<CreateCourseResponse> {
        let {payload}: CreateCourseEntityCommand = request.body;
        let {courseId} = await this.coursesHandler.createCourse(payload);
        let [courseTraining, courseStructure, adminCourseDescriptions] = await Promise.all([
            await this.courseViewQuery.loadCourseTraining(courseId),
            await this.courseStructureViewQuery.searchView({id: courseId}),
            await this.userAdminCoursesViewQuery.searchView({id: payload.userId})
        ]);
        return {courseTraining, courseStructure, adminCourseDescriptions};
    }

    async saveCourse (request: Request): Promise<SaveCourseResponse> {
        let course: SaveCourseEntityPayload = request.body.payload;
        await coursesHandler.saveCourse(course);
        let [courseTraining, courseStructure] = await Promise.all([
            await this.courseViewQuery.loadCourseTraining(course.id),
            await this.courseStructureViewQuery.searchView({id: course.id})
        ]);
        return {courseStructure, courseTraining};
    }

    async createModule (request: Request): Promise<CreateModuleResponse> {
        let createModuleData: CreateModuleEntityPayload = request.body.payload;
        let {moduleId} = await this.coursesHandler.createModule(createModuleData);
        let [module, courseStructure] = await Promise.all([
            this.moduleViewQuery.loadModule(moduleId),
            this.courseStructureViewQuery.searchView({id: createModuleData.courseId})
        ]);
        return {moduleId, module, courseStructure};
    }

    async saveModule (request: Request): Promise<SaveTrainingResponse> {
        let saveModuleData: SaveModuleEntityPayload = request.body.payload;
        await this.coursesHandler.saveModule(saveModuleData);
        let {courseId, id: moduleId} = saveModuleData;
        let [courseStructure, module] = await Promise.all([
            this.courseStructureViewQuery.searchView({id: courseId}),
            this.moduleViewQuery.loadModule(moduleId)
        ]);
        return {courseStructure, training: module};
    }

    async createSection (request: Request) {
        let createSectionData: CreateSectionEntityPayload = request.body;
        let {courseId} = createSectionData;
        let {sectionId} = await this.coursesHandler.createSection(createSectionData);
        let [courseStructure, section] =
            await Promise.all([
                this.courseStructureViewQuery.searchView({id: courseId}),
                this.sectionViewQuery.loadSection(sectionId)
            ]);
        return {sectionId, courseStructure, section};
    }

    async saveSection (request: Request): Promise<SaveSectionResponse> {
        let saveSectionData: SaveSectionEntityPayload = request.body.payload;
        await this.coursesHandler.saveSection(saveSectionData);
        let {id, courseId} = saveSectionData;
        let [courseStructure, section] = await Promise.all([
            this.courseStructureViewQuery.searchView({id: courseId}),
            this.sectionViewQuery.loadSection(id)
        ]);
        return {courseStructure, section};
    }


    registerRoutes (router: Router) {
        router.post('/courses/create', this.validateHandle(this.createCourse, validateCreateCourse));
        router.post('/course/save/:courseId', this.validateHandle(this.saveCourse, validateSaveCourse));
        router.post('/course/:courseId/module/create', this.validateHandle(this.createModule));
        router.post('/course/:courseId/module/:moduleId/save', this.validateHandle(this.saveModule));
        router.post('/course/:courseId/module/:moduleId/section/create', this.validateHandle(this.createSection));
        router.post('/course/:courseId/module/:moduleId/section/:sectionId/save', this.validateHandle(this.saveSection));
    }
}

