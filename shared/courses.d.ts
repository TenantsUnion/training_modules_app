import {Moment} from "moment";

declare namespace courses {

    export interface CourseData {
        title: string,
        timeEstimate: string,
        description: string,
        createdBy: string
    }

    export interface UserEnrolledCourseData extends CourseData {
        username: string
        userId: string
        //todo maybe user description?
        //todo module and section progress
    }

    export interface UserAdminCourseData extends CourseData {
        admins: string[]
    }


    export interface CourseUserInfo {
        userId: string;
        username: string;
    }

    export interface CourseUserDescription {
        id: string;
        username: string;
        firstName: string;
        lastName: string;
    }

    export interface CourseDescription {
        id: string;
        title: string;
        timeEstimate
    }

    export interface EnrolledCourseDescription extends CourseDescription {
        lastActive?: Moment;
    }

    export interface AdminCourseDescription extends CourseDescription {
    }
}

export = courses;
