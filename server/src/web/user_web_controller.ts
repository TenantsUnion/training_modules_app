import {AbstractWebController} from "./abstract_routes_controller";
import {Router} from "express";
import {UserCoursesListingPayload} from "@shared/user";
import {getLogger} from "../log";
import {UserCoursesListingViewQuery} from "../views/user/user_courses_listing_view_query";

export class UserWebController extends AbstractWebController {


    constructor (private userCoursesListingViewQuery: UserCoursesListingViewQuery) {
        super(getLogger('UserWebController', 'info'));
    }

    async loadUserCourseListings (req): Promise<UserCoursesListingPayload> {
        let userId = req.params.userId;
        let {0: admin, 1: enrolled} = await Promise.all([
            await this.userCoursesListingViewQuery.loadUserAdminCourses(userId),
            await this.userCoursesListingViewQuery.loadUserEnrolledCourses(userId)
        ]);
        return {admin, enrolled};
    }

    registerRoutes (router: Router) {
        router.get(`/user/:userId/course/listings`, this.handle(this.loadUserCourseListings));
    }
}