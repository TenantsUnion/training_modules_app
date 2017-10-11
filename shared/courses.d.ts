import {Moment} from "moment";
import {ModuleDetails, ViewModuleQuillData, ViewModuleTransferData} from './modules';
import {QuillEditorData} from './quill';

declare namespace courses {

    export interface CreateCourseData {
        title: string,
        active: boolean,
        timeEstimate: string,
        description: string,
        createdBy: string
    }

    export interface SaveCourseData {
        id: string,
        title: string,
        active: boolean,
        timeEstimate: string,
        description: string,
        updatedByUserId: string;
        modules: string[]
    }

    interface ViewCourseData {
        id: string,
        title: string,
        active: boolean,
        description: string,
        timeEstimate: string,
        createdBy: string
    }

    export interface ViewCourseQuillData extends ViewCourseData {
        lastModifiedAt: Moment;
        modules: ViewModuleTransferData[];
        content: QuillEditorData[];
    }

    /**
     * The transfer shape of a course view where properties that refer to quill data instead of have a string of
     * the corresponding ids and timestamps are in string form.
     */
    export interface ViewCourseTransferData extends ViewCourseData {
        lastModifiedAt: string;
        modules: ViewModuleTransferData[],
        contentIds: string[]
    }

    export interface UserEnrolledCourseData extends ViewCourseQuillData {
        username: string
        userId: string
        //todo maybe user description?
        //todo module and section progress
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
