import * as express from "express";
import {Request, Response, Router} from "express";
import {
    AdminCourseDescription, ViewCourseQuillData, CreateCourseData, SaveCourseData
} from "courses";
import {CoursesHandler} from "./courses_handler";
import {getLogger} from '../log';
import {CreateModuleData, SaveModuleData} from "../../../shared/modules";
import {CoursesRepository} from './courses_repository';
import {ModuleOperations} from '../module/module_routes';
import {CreateSectionData} from '../../../shared/sections';
import {coursesHandler} from '../config/handler.config';
import {Exception} from 'winston';

export class CoursesController implements ModuleOperations {
    logger = getLogger('CoursesController', 'info');

    constructor(private coursesHandler: CoursesHandler,
                private coursesRepo: CoursesRepository) {
    }

    createCourse(request: Request, response: Response) {
        let courseInfo: CreateCourseData = request.body;
        (async () => {
            try {
                //todo check permissions/validate
                let result = await this.coursesHandler.createCourse(courseInfo);
                response.status(200).send(result);
            } catch (e) {
                this.logger.log('error', e);
                this.logger.log('error', e.stack);
                response.status(500).send(e);
                //server error
            }

        })();
    }

    saveCourse(request: express.Request, response: express.Response) {
        let course: SaveCourseData = request.body;
        (async () => {
            try {
                let result = await coursesHandler.saveCourse(course);
                response.status(200).send(result);
            } catch (e) {
                this.logger.log('error', e);
                this.logger.log('error', e.stack);
                response.status(500).send(e);
                //server error
            }
        })();
    }

    getUserEnrolledCourses(request: Request, response: Response) {
        let username: string = request.params.username;

        (async () => {
            let userCourses: AdminCourseDescription[];
            try {
                userCourses = await this.coursesHandler.getUserEnrolledCourses(username);
            } catch (e) {
                console.log(e.stack);
                response.status(500)
                    .send(e);
            }

            response.status(200)
                .send(userCourses);
        })();
    }

    getUserAdminCourses(request: Request, response: Response) {
        let username: string = request.params.username;

        (async () => {
            let userCourses: AdminCourseDescription[];
            try {
                userCourses = await this.coursesHandler.getUserAdminCourses(username);
            } catch (e) {
                this.logger.log('error', e);
                this.logger.log('error', e.stack);
                response.status(500)
                    .send(e.stack.join('\n'));
            }

            response.status(200)
                .send(userCourses);
        })();
    }

    loadAdminCourse(request: Request, response: Response) {
        let courseTitle: string = request.params.courseTitle;
        let username: string = request.params.username;
        (async () => {
            try {
                let course = await this.coursesRepo.loadUserAdminCourse({
                    username: username,
                    courseTitle: courseTitle
                });
                response.status(200).send(course);
            } catch (e) {
                this.logger.log('error', e);
                this.logger.log('error', e.stack);
                response.status(500)
                    .send(e.stack.join('\n'));
            }
        })();
    }

    createModule(request: express.Request, response: express.Response) {
        let courseId: string = request.params.courseId;
        let createModuleData: CreateModuleData = request.body;
        (async () => {
            try {
                let course = await this.coursesHandler.createModule(createModuleData);
                response.status(200)
                    .send(course);
            } catch (e) {
                this.logger.log('error', e);
                this.logger.log('error', e.stack);
                response.status(500)
                    .send(e.stack.join('\n'));
            }
        })();
    }

    saveModule(request: express.Request, response: express.Response) {
        let saveModuleData: SaveModuleData = request.body;
        (async () => {
            try {
                let course = await this.coursesHandler.saveModule(saveModuleData);
                response.status(200).send(course);
            } catch (e) {
                this.logger.log('error', e);
                this.logger.log('error', e.stack);
                response.status(500)
                    .send(e.stack.join('\n'));
            }
        })()
    }

    createSection(request: express.Request, response: express.Response) {
        let createSectionData: CreateSectionData = request.body;
        (async () => {
            try {
                let course = await this.coursesHandler.createSection(createSectionData);
                response.status(200)
                    .send(course);
            } catch (e) {
                this.logger.error(e);
                this.logger.error(e.stack);
                response.status(500)
                    .send(e.stack.join('\n'));
            }
        })();
    }
}

