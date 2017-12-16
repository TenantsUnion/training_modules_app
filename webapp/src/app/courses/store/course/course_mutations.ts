import Vue from "vue";
import {CourseState} from './course_state';
import {CourseEntity, ViewCourseQuillData} from 'courses.ts';
import {Mutation, MutationTree} from 'vuex';
import {RequestStage} from '../../../../../../shared/requests';

export type CourseMutation<P> = (state: CourseState, payload: P) => any | Mutation<CourseState>;

/**
 * Const for using course mutation type values
 */
export const COURSE_MUTATIONS: {[index in keyof  CourseMutations]: keyof CourseMutations} = {
    SET_CURRENT_COURSE: 'SET_CURRENT_COURSE',
    SET_COURSE_REQUEST_STAGE: 'SET_COURSE_REQUEST_STAGE',
    SET_COURSE_ADMIN: 'SET_COURSE_ADMIN',
    SET_COURSE_ENTITY: 'SET_COURSE_ENTITY'
};

export interface CourseMutations {
    SET_CURRENT_COURSE: CourseMutation<{id}>;
    SET_COURSE_REQUEST_STAGE: CourseMutation<{id: string; requesting: boolean}>,
    SET_COURSE_ADMIN: CourseMutation<boolean>;
    SET_COURSE_ENTITY: CourseMutation<CourseEntity>;

    [key: string]: Mutation<CourseState>;
}

/**
 * Store mutations
 */
export const coursesMutations: CourseMutations & MutationTree<CourseState> = {
    SET_CURRENT_COURSE: (state: CourseState, {id}) => {
        state.currentCourseId = id;
    },
    SET_COURSE_REQUEST_STAGE: (state: CourseState, {id, requesting}) => {
        Vue.set(state.courseRequests, id, requesting);
    },
    SET_COURSE_ADMIN: (state: CourseState, isAdmin: boolean) => {
        state.isAdmin = isAdmin;
    },
    SET_COURSE_ENTITY: (state: CourseState, courseEntity: CourseEntity) => {
        Vue.set(state.courses, courseEntity.id, courseEntity);
    }
};
