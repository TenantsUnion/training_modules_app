import * as express from "express";
import {Request, Response, Router} from "express";
import {
    EnrolledCourseDescription, CourseUserDescription,
    CourseData
} from "courses";
import {ContentDescriptionEntity} from "content";
import {coursesHandler, ICoursesHandler} from "./courses_handler";

export class CoursesController {
    constructor(private coursesHandler: ICoursesHandler) {
    }

    createCourse(request: Request, response: Response) {
        let courseInfo: CourseData = request.body;
        courseInfo.createdBy = request.session.user_id;
        let result;
        (async () => {
            try {
                //todo check permissions/validate
                result = await this.coursesHandler.createCourse(courseInfo);
            } catch (e) {
                console.log(e.stack);
                response.status(500) //server error
                    .send(e);
            }

            response.status(200)
                .send(result);
        })();
    }

    getUserEnrolledCourses(request: Request, response: Response) {
        let username: string = request.params.username;

        (async () => {
            let userCourses: EnrolledCourseDescription[];
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
            let userCourses: string | ContentDescriptionEntity;
            try {
                let userCourses = await this.coursesHandler.getUserEnrolledCourses(username);
            } catch (e) {
                console.log(e.stack);
                response.status(500)
                    .send(e.stack('\n'));
            }

            response.status(200)
                .send(userCourses);
        })();
    }
}

let coursesController = new CoursesController(coursesHandler);

let router: Router = express.Router();
router.post('/courses/create', (request, response) => {
    coursesController.createCourse(request, response);
});

router.get('/courses/user/enrolled/:username', (request, response) => {
    coursesController.getUserEnrolledCourses(request, response);
});

router.get('/courses/user/admin/:username', (request, response) => {
    coursesController.getUserAdminCourses(request, response);
});

export const CoursesRoutes = router;

