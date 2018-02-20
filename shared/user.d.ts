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
}
export = user;