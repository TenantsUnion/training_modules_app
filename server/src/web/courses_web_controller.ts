import * as express from "express";
import {Router, Request} from "express";
import {
    CreateCourseEntityCommand, SaveCourseEntityPayload,
    CreateCourseResponse, SaveCourseResponse
} from "@shared/courses";
import {AdminCourseHandler} from "@course/admin/course_admin_handler";
import {getLogger} from '../log';
import {
    CreateModuleEntityPayload, CreateModuleResponse, SaveModuleEntityPayload,
    SaveModuleResponse
} from "@shared/modules";
import {
    CreateSectionEntityPayload, SaveSectionEntityPayload,
    SaveSectionResponse
} from '@shared/sections';
import {coursesHandler} from '../config/handler_config';
import {CourseViewQuery} from "@course/view/course_views_query";
import {validateCreateCourse, validateSaveCourse} from "@course/admin/course_admin_validation";
import {ModuleViewQuery} from "@module/module_view_query";
import {SectionViewQuery} from "@section/admin/section_view_query";
import {AbstractCommandController} from "./abstract_routes_controller";
import {CourseStructureViewQuery} from "@course/view/course_structure_view_query";

export class CourseCommandController extends AbstractCommandController {
    constructor (private coursesHandler: AdminCourseHandler,
                 private courseViewQuery: CourseViewQuery,
                 private moduleViewQuery: ModuleViewQuery,
                 private sectionViewQuery: SectionViewQuery,
                 private courseStructureViewQuery: CourseStructureViewQuery) {
        super(getLogger('CoursesController', 'info'))
    }

    async createCourse (request: Request): Promise<CreateCourseResponse> {
        let {payload}: CreateCourseEntityCommand = request.body;
        let {courseId} = await this.coursesHandler.createCourse(payload);
        let [courseTraining, courseStructure, adminCourseDescriptions] = await Promise.all([
            await this.courseViewQuery.loadCourseTraining(courseId),
            await this.courseStructureViewQuery.loadCourseStructure(courseId),
            await this.courseViewQuery.loadUserAdminCourses(request.session.user_id)
        ]);
        return {courseTraining, courseStructure, adminCourseDescriptions};
    }

    async saveCourse (request: Request): Promise<SaveCourseResponse> {
        let course: SaveCourseEntityPayload = request.body.payload;
        await coursesHandler.saveCourse(course);
        let [courseTraining, courseStructure] = await Promise.all([
            await this.courseViewQuery.loadCourseTraining(course.id),
            await this.courseStructureViewQuery.loadCourseStructure(course.id)
        ]);
        return {courseStructure, courseTraining};
    }

    async createModule (request: Request): Promise<CreateModuleResponse> {
        let createModuleData: CreateModuleEntityPayload = request.body.payload;
        let {moduleId} = await this.coursesHandler.createModule(createModuleData);
        let [module, courseStructure] = await Promise.all([
            this.moduleViewQuery.loadModule(moduleId),
            this.courseStructureViewQuery.loadCourseStructure(createModuleData.courseId)
        ]);
        return {moduleId, module, courseStructure};
    }

    async saveModule (request: Request): Promise<SaveModuleResponse> {
        let saveModuleData: SaveModuleEntityPayload = request.body.payload;
        await this.coursesHandler.saveModule(saveModuleData);
        let {courseId, id: moduleId} = saveModuleData;
        let [courseStructure, module] = await Promise.all([
            this.courseStructureViewQuery.loadCourseStructure(courseId),
            this.moduleViewQuery.loadModule(moduleId)
        ]);
        return {courseStructure, module};
    }

    async createSection (request: Request) {
        let createSectionData: CreateSectionEntityPayload = request.body;
        let {courseId} = createSectionData;
        let {sectionId} = await this.coursesHandler.createSection(createSectionData);
        let [courseStructure, section] =
            await Promise.all([
                this.courseStructureViewQuery.loadCourseStructure(courseId),
                this.sectionViewQuery.loadSection(sectionId)
            ]);
        return {sectionId, courseStructure, section};
    }

    async saveSection (request: express.Request): Promise<SaveSectionResponse> {
        let saveSectionData: SaveSectionEntityPayload = request.body.payload;
        await this.coursesHandler.saveSection(saveSectionData);
        let {id, courseId} = saveSectionData;
        let [courseStructure, section] = await Promise.all([
            this.courseStructureViewQuery.loadCourseStructure(courseId),
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

