import * as express from "express";
import {Request, Response} from "express";
import {
    AdminCourseDescription, SaveCourseEntityCommand, CreateCourseEntityCommand
} from "courses.ts";
import {CoursesHandler} from "./courses_handler";
import {getLogger} from '../log';
import {CreateModuleEntityCommand, SaveModuleData} from "../../../shared/modules";
import {CoursesRepository} from './courses_repository';
import {ModuleOperations} from '../module/module_routes';
import {CreateSectionEntityPayload, SaveSectionData} from '../../../shared/sections';
import {coursesHandler} from '../config/handler_config';
import {SectionOperations} from '../section/section_routes';
import {validateCreateCourse, validateSaveCourse} from './courses_validation';
import {logHandleServerError, logHandleValidationError} from '../util/handle_validation_error';
import {CoursesViewHandler} from './courses_view_handler';
import {courseQueryService} from '../config/query_service_config';

export class CourseCommandController implements ModuleOperations, SectionOperations {
    private logger = getLogger('CoursesController', 'info');
    private handleValidationErr = logHandleValidationError(this.logger);
    private handleServerErr = logHandleServerError(this.logger);

    constructor(private coursesHandler: CoursesHandler,
                private coursesRepo: CoursesRepository,
                private coursesViewHandler: CoursesViewHandler) {
    }

    async createCourse(request: Request, response: Response) {
        let createCourseCommand: CreateCourseEntityCommand = request.body;
        try {
            let errMsgs = validateCreateCourse(createCourseCommand);
            if (errMsgs) {
                this.handleValidationErr(errMsgs, request, response);
            } else {
                let result = await this.coursesHandler.createCourse(createCourseCommand);
                // todo handle room creation for course
                response.status(200).send(result);
            }
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async saveCourse(request: express.Request, response: express.Response) {
        let course: SaveCourseEntityCommand = request.body;
        try {
            let errMsgs = validateSaveCourse(course);
            if (errMsgs) {
                this.handleValidationErr(errMsgs, request, response);
            } else {
                let result = await coursesHandler.saveCourse(course);
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
        let username: string = request.params.username;
        try {
            let userCourses: AdminCourseDescription[] = await this.coursesViewHandler.getUserAdminCourses(username);
            response.status(200).send(userCourses);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }
    async createModule(request: express.Request, response: express.Response) {
        let courseId: string = request.params.courseId;
        let createModuleData: CreateModuleEntityCommand = request.body;
        try {
            let course = await this.coursesHandler.createModule(createModuleData);
            response.status(200).send(course);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async saveModule(request: express.Request, response: express.Response) {
        let saveModuleData: SaveModuleData = request.body;
        try {
            let course = await this.coursesHandler.saveModule(saveModuleData);
            response.status(200).send(course);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async createSection(request: express.Request, response: express.Response) {
        let createSectionData: CreateSectionEntityPayload = request.body;
        try {
            let course = await this.coursesHandler.createSection(createSectionData);
            response.status(200).send(course);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async saveSection(request: express.Request, response: express.Response) {
        let saveSectionData: SaveSectionData = request.body;
        try {
            let course = await this.coursesHandler.saveSection(saveSectionData);
            response.status(200).send(course);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async loadUserAdminCourseWebView(request: Request, response: Response) {
        let {courseId} = request.params;
        try {
            let course = await this.coursesRepo.loadAdminCourse(courseId);
            response.status(200).send(course);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }
}

