import * as express from "express";
import {Request, Response, Router} from "express";
import {
    AdminCourseDescription, ViewCourseQuillData, CreateCourseData, SaveCourseEntityCommand
} from "courses";
import {CoursesHandler} from "./courses_handler";
import {getLogger} from '../log';
import {CreateModuleData, SaveModuleData} from "../../../shared/modules";
import {CoursesRepository} from './courses_repository';
import {ModuleOperations} from '../module/module_routes';
import {CreateSectionData, SaveSectionData} from '../../../shared/sections';
import {coursesHandler} from '../config/handler.config';
import {Exception} from 'winston';
import {SectionOperations} from '../section/section_routes';
import {validateCreateCourse, validateSaveCourse} from './courses_validation';
import {logHandleServerError, logHandleValidationError} from '../util/handle_validation_error';

export class CoursesController implements ModuleOperations, SectionOperations {
    private logger = getLogger('CoursesController', 'info');
    private handleValidationErr = logHandleValidationError(this.logger);
    private handleServerErr = logHandleServerError(this.logger);

    constructor(private coursesHandler: CoursesHandler,
                private coursesRepo: CoursesRepository) {
    }

    async createCourse(request: Request, response: Response) {
        let courseInfo: CreateCourseData = request.body;
        try {
            let errMsgs = validateCreateCourse(courseInfo);
            if (errMsgs) {
                this.handleValidationErr(errMsgs, request, response);
            } else {
                let result = await this.coursesHandler.createCourse(courseInfo);
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
            let userCourses = await this.coursesHandler.getUserEnrolledCourses(username);
            response.status(200).send(userCourses);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async getUserAdminCourses(request: Request, response: Response) {
        let username: string = request.params.username;
        try {
            let userCourses: AdminCourseDescription[] = await this.coursesHandler.getUserAdminCourses(username);
            response.status(200).send(userCourses);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }

    }

    async loadAdminCourse(request: Request, response: Response) {
        let courseTitle: string = request.params.courseTitle;
        let username: string = request.params.username;
        try {
            let course = await this.coursesRepo.loadUserAdminCourse({
                username: username,
                courseTitle: courseTitle
            });

            response.status(200).send(course);
        } catch (e) {
            this.handleServerErr(e, request, response);
        }
    }

    async createModule(request: express.Request, response: express.Response) {
        let courseId: string = request.params.courseId;
        let createModuleData: CreateModuleData = request.body;
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
        let createSectionData: CreateSectionData = request.body;
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
}

