import {AdminCourseDescription, EnrolledCourseDescription} from "@shared/courses";
import {UserCourseProgressView} from "../server/src/user_progress/user_progress_view_query";

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
        admin: AdminCourseDescription[];
        enrolled: EnrolledCourseDescription[];
    }

    interface EnrollCourseResponse {
        courseProgress: UserCourseProgressView;
        enrolledCourses: EnrolledCourseDescription[];
    }
}
export = user;