import {AbstractWebController} from "./abstract_routes_controller";
import {getLogger} from "../log";
import {Router, Request} from "express";
import {UserProgressHandler} from "../user_progress/user_progress_handler";
import {UserCourseProgressView, UserProgressViewQuery} from "../user_progress/user_progress_view_query";
import {EnrollCourseRequestPayload} from "@shared/user";

export class UserProgressWebController extends AbstractWebController {


    constructor (private userProgressHandler: UserProgressHandler,
                 private userProgressViewQuery: UserProgressViewQuery) {
        super(getLogger('UserProgressWebController', 'info'));
    }

    async enrollInCourse (req: Request): Promise<UserCourseProgressView> {
        let payload: EnrollCourseRequestPayload = req.body;
        await this.userProgressHandler.enrollUserInCourse(payload);
        return await this.userProgressViewQuery.loadUserCourseProgress(payload);
    }

    async loadUserCourseProgress (req: Request): Promise<UserCourseProgressView> {
        let courseId = req.params.courseId;
        let userId = req.params.userId;
        return await this.userProgressViewQuery.loadUserCourseProgress({userId, courseId});
    }

    registerRoutes (router: Router): Router {
        return router
            .post('/user/course/enroll', this.handle(this.enrollInCourse));
    }
}