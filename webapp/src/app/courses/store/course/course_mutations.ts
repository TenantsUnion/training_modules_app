import Vue from "vue";
import {MutationType} from 'store.ts';
import {CourseState} from './course_state';
import {CourseEntity} from 'courses.ts';
import {Mutation, MutationTree} from 'vuex';
import {RequestStage} from '../../../../../../shared/requests';

export interface COURSE_MUTATIONS {
    SET_CURRENT_COURSE: 'SET_CURRENT_COURSE',
    SET_COURSE_REQUEST_STAGE: 'SET_COURSE_REQUEST_STAGE',
    SET_COURSE_ADMIN: 'SET_COURSE_ADMIN',
    SET_COURSE_ENTITY: 'SET_COURSE_ENTITY'

    [index: string]: keyof COURSE_MUTATIONS
}

export type CourseMutation = MutationType<CourseState, CourseEntity> | Mutation<CourseState>;
export type CourseMutationTree = MutationTree<CourseState> & { [index in keyof COURSE_MUTATIONS]: CourseMutation }

/**
 * Const for using course mutation type values
 */
export const COURSE_MUTATIONS: COURSE_MUTATIONS = {
    SET_CURRENT_COURSE: 'SET_CURRENT_COURSE',
    SET_COURSE_REQUEST_STAGE: 'SET_COURSE_REQUEST_STAGE',
    SET_COURSE_ADMIN: 'SET_COURSE_ADMIN',
    SET_COURSE_ENTITY: 'SET_COURSE_ENTITY'
};

export interface CourseMutations extends CourseMutationTree {
    SET_CURRENT_COURSE: CourseMutation,
    SET_COURSE_REQUEST_STAGE: CourseMutation,
    SET_COURSE_ADMIN: CourseMutation,
    SET_COURSE_ENTITY: CourseMutation
}

/**
 * Store mutations
 */
export const coursesMutations: CourseMutations = {
    SET_CURRENT_COURSE: (state: CourseState, course: {
        id: string,
        isAdmin: boolean | undefined,
        course?: CourseEntity // assumes that quill data is already populated
    }) => {
        state.currentCourseId = course.id;
        state.isAdmin = !!course.isAdmin;
    },
    SET_COURSE_REQUEST_STAGE: (state: CourseState, course: {id: string, stage: RequestStage}) => {
        Vue.set(state.courseRequests, course.id, course.stage);
    },
    SET_COURSE_ADMIN: (state: CourseState, isAdmin: boolean) => {
        state.isAdmin = isAdmin;
    },
    SET_COURSE_ENTITY: (state: CourseState, courseEntity: CourseEntity) => {
        Vue.set(state.courses, courseEntity.id, courseEntity);
    }
};
