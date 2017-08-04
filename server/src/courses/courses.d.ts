declare namespace courses {
    export interface CourseUserInfo {
        userId: string;
        username: string;
    }

    export interface CourseListEntity {
        id: string;
        title: string;
    }

    export interface UserListEntity {
        id: string;
        username: string;
        firstName: string;
        lastName: string;
    }

    export interface CourseEntity extends CourseListEntity {
        admins: CourseUserInfo[],
        enrolled: CourseUserInfo[]
    }

    export interface UserCoursesEntity {
        userId: string;
        adminOfCourses: CourseListEntity[],
        enrolledInCourses: CourseListEntity[]
    }

    export interface CourseUsersEntity {
        courseId: string;
        enrolledUsers: UserListEntity[],
        adminUsers: UserListEntity[]
    }
}

export = courses;

