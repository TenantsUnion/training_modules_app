import {CreateCourseEntityPayload, SaveCourseEntityPayload} from '@shared/courses';

export type ValidationResult = { [index: string]: string } | null;
export const validateCreateCourse = (createCourseCommand: CreateCourseEntityPayload): ValidationResult => {
    let errorMsgs = {};
    if (!createCourseCommand.title) {
        errorMsgs['title'] = 'Title required for course';
    }

    return Object.keys(errorMsgs).length ? errorMsgs : null;
};

export const validateSaveCourse: (data: SaveCourseEntityPayload) => ValidationResult = (data) => {
    let errorMsgs = {};
    return null;
};