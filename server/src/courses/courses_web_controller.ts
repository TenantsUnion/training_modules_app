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
    SaveModuleResponse
} from "@shared/modules";
import {ModuleOperations} from './module/module_routes';
import {
    CreateSectionEntityPayload, CreateSectionResponse, SaveSectionEntityPayload,
    SaveSectionResponse
} from '@shared/sections';
import {coursesHandler, coursesViewHandler} from '../config/handler_config';
import {SectionOperations} from './section/section_routes';
import {validateCreateCourse, validateSaveCourse} from './courses_validation';
import {logHandleServerError, logHandleValidationError} from '../util/handle_validation_error';
import {CoursesViewHandler} from './courses_view_handler';

export class CourseCommandController implements ModuleOperations, SectionOperations {
    private logger = getLogger('CoursesController', 'info');
    private handleValidationErr = logHandleValidationError(this.logger);
    private handleServerErr = logHandleServerError(this.logger);

    constructor(private coursesHandler: CoursesHandler,
                private coursesViewHandler: CoursesViewHandler) {
    }

    async createCourse(request: Request, response: Response) {
        let createCourseCommand: CreateCourseEntityCommand = request.body;
        try {
            let errMsgs = validateCreateCourse(createCourseCommand);
            if (errMsgs) {
                this.handleValidationErr(errMsgs, request, response);
            } else {
                let {courseId}  = await this.coursesHandler.createCourse(createCourseCommand);
                let createdCourse: CreateCourseResponse = await this.coursesViewHandler.loadAdminCourse(courseId);
                // todo handle room creation for course
                response.status(200).send(createdCourse);
            }
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async saveCourse(request: express.Request, response: express.Response) {
        let course: SaveCourseEntityPayload = request.body.payload;
        try {
            let errMsgs = validateSaveCourse(course);
            if (errMsgs) {
                this.handleValidationErr(errMsgs, request, response);
            } else {
                    await coursesHandler.saveCourse(course);
                let result: SaveCourseResponse = {
                    course: await coursesViewHandler.loadAdminCourse(course.id)
                };
                response.status(200).send(result);
            }
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async getUserEnrolledCourses(request: Request, response: Response) {
        let username: string = request.params.username;
        try {
            let userCourses = await this.coursesViewHandler.getUserEnrolledCourses(username);
            response.status(200).send(userCourses);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async getUserAdminCourses(request: Request, response: Response) {
        let userId: string = request.params.userId;
        try {
            let userCourses: AdminCourseDescription[] = await this.coursesViewHandler.getUserAdminCourses(userId);
            response.status(200).send(userCourses);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async createModule(request: express.Request, response: express.Response) {
        let createModuleData: CreateModuleEntityPayload = request.body.payload;
        try {
            let moduleId = await this.coursesHandler.createModule(createModuleData);
            let result: CreateModuleResponse = {
                moduleId,
                course: await this.coursesViewHandler.loadAdminCourse(createModuleData.courseId)
            };
            response.status(200).send(result);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async saveModule(request: express.Request, response: express.Response) {
        let saveModuleData: SaveModuleEntityPayload = request.body.payload;
        try {
            await this.coursesHandler.saveModule(saveModuleData);
            let result: SaveModuleResponse = {
                moduleId: saveModuleData.id,
                course: await this.coursesViewHandler.loadAdminCourse(saveModuleData.courseId)
            };
            response.status(200).send(result);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async createSection(request: express.Request, response: express.Response) {
        let createSectionData: CreateSectionEntityPayload = request.body;
        try {
            let sectionId = await this.coursesHandler.createSection(createSectionData);
            let result: CreateSectionResponse = {
                sectionId,
                course: await this.coursesViewHandler.loadAdminCourse(createSectionData.courseId)
            };
            response.status(200).send(result);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async saveSection(request: express.Request, response: express.Response) {
        let saveSectionData: SaveSectionEntityPayload = request.body.payload;
        try {
            await this.coursesHandler.saveSection(saveSectionData);
            let result: SaveSectionResponse = {
                sectionId: saveSectionData.id,
                moduleId: saveSectionData.moduleId,
                course: await this.coursesViewHandler.loadAdminCourse(saveSectionData.courseId)
            };
            response.status(200).send(result);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async loadUserAdminCourseWebView(request: Request, response: Response) {
        let {courseId} = request.params;
        try {
            let course = await this.coursesViewHandler.loadAdminCourse(courseId);
            response.status(200).send(course);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }
}

