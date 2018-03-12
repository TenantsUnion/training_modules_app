import Vue from "vue";
import {CourseState} from './course_state';
import {Mutation, MutationTree} from 'vuex';
import {ViewModuleDescription} from "@shared/modules";

export enum CourseMode {
    ADMIN = 'ADMIN',
    ENROLLED = 'ENROLLED',
    PREVIEW = 'PREVIEW'
}

export type CourseMutation<P> = (state: CourseState, payload: P) => any | Mutation<CourseState>;

/**
 * Const for using course mutation type values
 */
export enum COURSE_MUTATIONS {
    SET_CURRENT_COURSE = 'SET_CURRENT_COURSE',
    SET_COURSE_REQUEST_STAGE = 'SET_COURSE_REQUEST_STAGE',
    SET_COURSE_MODULE_DESCRIPTIONS = 'SET_COURSE_MODULE_DESCRIPTIONS'
};

export interface CourseMutations extends MutationTree<CourseState> {
    SET_CURRENT_COURSE: CourseMutation<string>;
    SET_COURSE_REQUEST_STAGE: CourseMutation<{ id: string; requesting: boolean }>,
    SET_COURSE_MODULE_DESCRIPTIONS: CourseMutation<{ courseId: string, courseModuleDescriptions: ViewModuleDescription[] }>;
}

/**
 * Store mutations
 */
export const coursesMutations: CourseMutations = {
    SET_CURRENT_COURSE: (state: CourseState, id) => {
        state.currentCourseId = id;
    },
    SET_COURSE_REQUEST_STAGE: (state: CourseState, {id, requesting}) => {
        Vue.set(state.courseRequests, id, requesting);
    },
    SET_COURSE_MODULE_DESCRIPTIONS: (state: CourseState, descriptionData) => {
        let viewCourse = state.courses[descriptionData.courseId];
        viewCourse.modules = descriptionData.courseModuleDescriptions;
        Vue.set(state.courses, descriptionData.courseId, viewCourse);
    },
};
