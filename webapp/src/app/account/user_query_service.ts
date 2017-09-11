import {IUserInfo} from "user";
import {appRouter} from "../router";
import {Route} from "vue-router/types/router";
import {accountHttpService} from "./account_http_service";

export class UserQueryService {
    currentUser: IUserInfo;
    adminCourses: { [index: string]: string };
    enrolledCourses: { [index: string]: string };

    setCurrentUser(userInfo: IUserInfo) {
        this.currentUser = userInfo;
        this.adminCourses = userInfo.adminOfCourseIds.reduce(function (accumulator, courseId) {
            accumulator[courseId] = courseId;
            return accumulator;
        }, {});

        this.enrolledCourses = userInfo.enrolledInCourseIds.reduce(function (accumulator, courseId) {
            accumulator[courseId] = courseId;
            return accumulator;
        }, {});
    }

    getUserId(): string {
        return this.currentUser.id;
    }

    getUsername(): string {
        return this.currentUser.username;
    }

    resetCurrentUser(): void {
        this.currentUser = null;
    }

    isUserLoggedIn(): boolean {
        return !!this.currentUser;
    }

    isUserCourseAdmin(courseId: string): boolean {
        return !!this.adminCourses[courseId];
    }

}

export const userQueryService = new UserQueryService();

appRouter.beforeEach((to: Route, from, next) => {
    let username = to.params.username;
    if (username && !userQueryService.isUserLoggedIn()) {
        accountHttpService.getLoggedInUserInfo()
            .then((userInfo) => {
                userQueryService.setCurrentUser(userInfo);
                next();
            })
            .catch((errorMessages) => {
                next(new Error(errorMessages));
            });
    } else {
        next();
    }
});
