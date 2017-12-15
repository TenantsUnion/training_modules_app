import {IUserInfo} from "user";

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
    resetCurrentUser(): void {
        this.currentUser = null;
    }
}

export const userQueryService = new UserQueryService();
