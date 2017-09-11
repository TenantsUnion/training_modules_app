import * as express from "express";
import {Request, Response, Router} from "express";
import {
    AdminCourseDescription, CourseData
} from "courses";
import {coursesHandler, ICoursesHandler} from "./courses_handler";
import {getLogger} from '../log';
import {CreateModuleData} from "../../../shared/modules";

export class CoursesController {
    logger = getLogger('CoursesController', 'info');

    constructor (private coursesHandler: ICoursesHandler) {
    }

    createCourse (request: Request, response: Response) {
        let courseInfo: CourseData = request.body;
        let result;
        (async () => {
            try {
                //todo check permissions/validate
                result = await this.coursesHandler.createCourse(courseInfo);
            } catch (e) {
                this.logger.log('error', e);
                this.logger.log('error', e.stack);
                response.status(500) //server error
                    .send(e);
            }

            response.status(200)
                .send(result);
        })();
    }

    getUserEnrolledCourses (request: Request, response: Response) {
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

    getUserAdminCourses (request: Request, response: Response) {
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

    loadAdminCourse (request: Request, response: Response) {
        let courseTitle: string = request.params.courseTitle;
        let username: string = request.params.username;
        (async () => {
            let course: CourseData;
            try {
                course = await this.coursesHandler.loadAdminCourse({
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

    createModule (request: express.Request, response: express.Response) {
        let courseId: string = request.params.courseId;
        let createModuleData: CreateModuleData = request.body;
        (async () => {
            try {
                await this.coursesHandler.createModule(courseId, createModuleData);
                response.sendStatus(200);
            } catch (e) {
                this.logger.log('error', e);
                this.logger.log('error', e.stack);
                response.status(500)
                    .send(e.stack.join('\n'));
            }
        })();
    }
}

let coursesController = new CoursesController(coursesHandler);

let router: Router = express.Router();
router.post('/courses/create', (request, response) => {
    coursesController.createCourse(request, response);
});

router.post('/courses/:courseId/module/create', (request, response) => {
    //todo(EG) create modules controller
    coursesController.createModule(request, response);
});


// loading courses, todo break out into separate controller
router.get('/courses/user/enrolled/:username', (request, response) => {
    coursesController.getUserEnrolledCourses(request, response);
});

router.get('/courses/user/admin/:username', (request, response) => {
    coursesController.getUserAdminCourses(request, response);
});

router.get('/user/:username/courses/admin/:courseTitle', (request, response) => {
    coursesController.loadAdminCourse(request, response);
});


export const CoursesRoutes = router;

