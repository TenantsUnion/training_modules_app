import {AbstractWebController} from "./abstract_routes_controller";
import {getLogger} from "../log";
import {Router, Request} from "express";
import {UserProgressHandler} from "../user_progress/user_progress_handler";
import {EnrollCourseRequestPayload, EnrollCourseResponse} from "@shared/user";
import {UserCoursesListingViewQuery} from "../user/user_courses_listing_view_query";
import {UserProgressViewQuery} from "../user_progress/user_progress_view_query";
import {TrainingProgressUpdate, UserCourseProgressView} from "@shared/user_progress";

export class UserProgressWebController extends AbstractWebController {


    constructor (private userProgressHandler: UserProgressHandler,
                 private userProgressViewQuery: UserProgressViewQuery,
                 private coursesListingViewQuery: UserCoursesListingViewQuery) {
        super(getLogger('UserProgressWebController', 'info'));
    }

    async enrollInCourse (req: Request): Promise<EnrollCourseResponse> {
        let payload: EnrollCourseRequestPayload = req.body;
        await this.userProgressHandler.enrollUserInCourse(payload);
        return {
            courseProgress: await this.userProgressViewQuery.loadUserCourseProgress(payload),
            enrolledCourses: await this.coursesListingViewQuery.loadUserEnrolledCourses(payload.userId)
        };
    }

    async saveTrainingProgress (req: Request): Promise<any> {
        let payload: TrainingProgressUpdate = req.body;
        await this.userProgressHandler.recordTrainingProgress(payload);
        // todo what to return?
    }

    async loadUserCourseProgress (req: Request): Promise<UserCourseProgressView> {
        let courseId = req.params.courseId;
        let userId = req.params.userId;
        return await this.userProgressViewQuery.loadUserCourseProgress({userId, courseId});
    }

    registerRoutes (router: Router): Router {
        return router
            .post('/user/course/enroll', this.handle(this.enrollInCourse))
            .post('/user/progress/save', this.handle(this.saveTrainingProgress));
    }
}