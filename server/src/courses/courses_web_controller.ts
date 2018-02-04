import * as express from "express";
import {Request, Response} from "express";
import {
    AdminCourseDescription, CreateCourseEntityCommand, SaveCourseEntityPayload,
    CreateCourseResponse, SaveCourseResponse
} from "@shared/courses";
import {CoursesHandler} from "./courses_handler";
import {getLogger} from '../log';
import {
    CreateModuleEntityPayload, CreateModuleResponse, SaveModuleEntityPayload,
    SaveModuleResponse} from "@shared/modules";
import {ModuleOperations} from './module/module_routes';
import {
    CreateSectionEntityPayload, SaveSectionEntityPayload,
    SaveSectionResponse
} from '@shared/sections';
import {coursesHandler} from '../config/handler_config';
import {SectionOperations} from './section/section_routes';
import {validateCreateCourse, validateSaveCourse} from './courses_validation';
import {logHandleServerError, logHandleValidationError} from '../util/handle_validation_error';
import {ModuleViewQuery} from './module/module_view_query';
import {SectionViewQuery} from './section/section_view_query';
import {CourseViewQuery} from "./view/course_views_query";

export class CourseCommandController implements ModuleOperations, SectionOperations {
    private logger = getLogger('CoursesController', 'info');
    private handleValidationErr = logHandleValidationError(this.logger);
    private handleServerErr = logHandleServerError(this.logger);

    constructor (private coursesHandler: CoursesHandler,
                 private courseViewQuery: CourseViewQuery,
                 private moduleViewQuery: ModuleViewQuery,
                 private sectionViewQuery: SectionViewQuery) {
    }

    async createCourse (request: Request, response: Response) {
        let createCourseCommand: CreateCourseEntityCommand = request.body;
        try {
            let errMsgs = validateCreateCourse(createCourseCommand);
            if (errMsgs) {
                this.handleValidationErr(errMsgs, request, response);
            } else {
                let {courseId} = await this.coursesHandler.createCourse(createCourseCommand);
                let createdCourse: CreateCourseResponse = await this.courseViewQuery.loadAdminCourse(courseId);
                // todo handle room creation for course
                response.status(200).send(createdCourse);
            }
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async saveCourse (request: express.Request, response: express.Response) {
        let course: SaveCourseEntityPayload = request.body.payload;
        try {
            let errMsgs = validateSaveCourse(course);
            if (errMsgs) {
                this.handleValidationErr(errMsgs, request, response);
            } else {
                await coursesHandler.saveCourse(course);
                let result: SaveCourseResponse = {
                    course: await this.courseViewQuery.loadAdminCourse(course.id)
                };
                response.status(200).send(result);
            }
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async getUserEnrolledCourses (request: Request, response: Response) {
        let username: string = request.params.username;
        try {
            let userCourses = await this.courseViewQuery.loadUserEnrolledCourse(username);
            response.status(200).send(userCourses);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async getUserAdminCourses (request: Request, response: Response) {
        let userId: string = request.params.userId;
        try {
            let userCourses: AdminCourseDescription[] = await this.courseViewQuery.loadUserAdminCourses(userId);
            response.status(200).send(userCourses);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async createModule (request: express.Request, response: express.Response) {
        let createModuleData: CreateModuleEntityPayload = request.body.payload;
        try {
            let {moduleId} = await this.coursesHandler.createModule(createModuleData);
            let {0: module, 1: courseModuleDescriptions} = await Promise.all([
                this.moduleViewQuery.loadModule(moduleId),
                this.courseViewQuery.loadModuleDescriptions(createModuleData.courseId)
            ]);
            let result: CreateModuleResponse = {
                moduleId,
                module: module,
                courseModuleDescriptions
            };
            response.status(200).send(result);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async saveModule (request: express.Request, response: express.Response) {
        let saveModuleData: SaveModuleEntityPayload = request.body.payload;
        try {
            await this.coursesHandler.saveModule(saveModuleData);
            let {courseId, id: moduleId} = saveModuleData;
            let {0: courseModuleDescriptions, 1: module} = await Promise.all([
                this.courseViewQuery.loadModuleDescriptions(courseId),
                this.moduleViewQuery.loadModule(moduleId)
            ]);
            let result: SaveModuleResponse = {courseModuleDescriptions, module};
            response.status(200).send(result);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async createSection (request: express.Request, response: express.Response) {
        let createSectionData: CreateSectionEntityPayload = request.body;
        let {courseId, moduleId} = createSectionData;
        try {
            let {sectionId} = await this.coursesHandler.createSection(createSectionData);
            let {0: courseModuleDescriptions, 1: moduleSectionDescriptions, 2: section} =
                await Promise.all([
                    this.courseViewQuery.loadModuleDescriptions(courseId),
                    this.moduleViewQuery.loadSectionDescriptions(moduleId),
                    this.sectionViewQuery.loadSection(sectionId)
                ]);
            response.status(200).send({
                sectionId,
                courseModuleDescriptions,
                moduleSectionDescriptions,
                section
            });
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async saveSection (request: express.Request, response: express.Response) {
        let saveSectionData: SaveSectionEntityPayload = request.body.payload;
        try {
            await this.coursesHandler.saveSection(saveSectionData);
            let {moduleId, courseId, id} = saveSectionData;
            let {0: courseModuleDescriptions, 1: moduleSectionDescriptions, 2: section} = await Promise.all([
                this.courseViewQuery.loadModuleDescriptions(courseId),
                this.moduleViewQuery.loadSectionDescriptions(moduleId),
                this.sectionViewQuery.loadSection(id)
            ]);
            let result: SaveSectionResponse = {
                courseModuleDescriptions, moduleSectionDescriptions, section
            };
            response.status(200).send(result);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async loadUserAdminCourseWebView (request: Request, response: Response) {
        let {courseId} = request.params;
        try {
            let course = await this.courseViewQuery.loadAdminCourse(courseId);
            response.status(200).send(course);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async loadModule (request: Request, response: Response) {
        let {moduleId} = request.params;
        try {
            let module = await this.moduleViewQuery.loadModule(moduleId);
            response.status(200).send(module);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async loadSection (request: Request, response: Response) {
        let {sectionId} = request.params;
        try {
            let section = await this.sectionViewQuery.loadSection(sectionId);
            response.status(200).send(section);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }
}

