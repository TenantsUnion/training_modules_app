import * as express from "express";
import {coursesHandler, ICoursesHandler} from "./courses_handler";
import {Request, Response, Router} from "express";
import {ICourseInfo} from "courses";
import {UserCoursesEntity} from "./courses";

export class CoursesController {
    constructor(private coursesHandler: ICoursesHandler) {
    }

    createCourse(request: Request, response: Response) {
        let courseInfo: ICourseInfo = request.body;
        courseInfo.createdBy = request.session.user_id;
        let result;
        (async () => {
            try {
                result = await this.coursesHandler.createCourse(courseInfo);
            } catch (e) {
                console.log(e.stack);
                response.status(500) //server error
                    .send(e.stack.join('\n'));
            }

            //if userId is a string, the client request data was
            //was not valid and an error message is returned
            let httpStatus = typeof result === 'string' ? 400 : 200;
            response.status(httpStatus)
                .send(result);
        })();
    }

    getUserCourses(request: Request, response: Response) {
        let userId: string = request.params.userId;
        (async () => {
            let userCourses: string | UserCoursesEntity;
            try {
                let userCourses = await this.coursesHandler.getUserCourses(userId);
            } catch (e) {
                console.log(e.stack);
                response.status(500)
                    .send(e.stack('\n'));
            }

            //if userId is a string, the client request data was
            //was not valid and an error message is returned
            let httpStatus = typeof userCourses === 'string' ? 400 : 200;
            response.status(httpStatus)
                .send(userId);
        })();
    }
}

let coursesController = new CoursesController(coursesHandler);

let router: Router = express.Router();
router.post('/create', (request, response) => {
    coursesController.createCourse(request, response);
});

router.post('/user/:userId', (request, response) => {
    coursesController.getUserCourses(request, response);
});

export const CoursesRoutes = router;

