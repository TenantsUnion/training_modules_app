import {Moment} from "moment";
import {ModuleData, ModuleDetails} from './modules';

declare namespace courses {

    export interface CreateCourseData {
        title: string,
        timeEstimate: string,
        description: string,
        createdBy: string
    }

    export interface CourseData {
        id: string,
        title: string,
        timeEstimate: string,
        description: string,
        createdBy: string
        modules: ModuleData[]
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
        timeEstimate: string;
    }

    export interface AdminCourseDescription extends CourseDescription {
        // lastActive?: Moment; todo set up user course progress tracking functionality
    }

    export interface EnrolledCourseDescription extends CourseDescription {
    }
}

export = courses;
