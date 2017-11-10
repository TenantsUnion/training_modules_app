import {CreateCourseData, SaveCourseEntityCommand} from '../../../shared/courses';

export type ValidationResult = { [index: string]: string } | null;
export const validateCreateCourse: (data: CreateCourseData) => ValidationResult = (data) => {
    let errorMsgs = {};
    if (!data.title) {
        errorMsgs['title'] = 'Title required for course';
    }

    //todo should there be validation for course title uniqueness?
    return Object.keys(errorMsgs).length ? errorMsgs : null;
};

export const validateSaveCourse: (data: SaveCourseEntityCommand) => ValidationResult = (data) => {
    // todo validate -- some how parse and create runtime validation code from interfaces for type enforcement?
    let errorMsgs = {};
    return null;
};