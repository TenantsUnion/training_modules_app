import {CourseDescription} from "./courses";
import {UserCourseProgressView} from "./user_progress";

declare namespace user {
    interface IUserInfo {
        id: string,
        username: string,
        firstName?: string,
        lastName?: string,
        adminOfCourseIds?: number[],
        enrolledInCourseIds?: number[],
        completedCourseIds?: number[]
    }

    interface IUserId {
        id: string
    }

    interface EnrollCourseRequestPayload {
        userId: string;
        courseId: string;
    }

    interface UserCoursesListingPayload {
        admin: CourseDescription[];
        enrolled: CourseDescription[];
    }

    interface EnrollCourseResponse {
        courseProgress: UserCourseProgressView;
        enrolledCourses: CourseDescription[];
    }
}
export = user;