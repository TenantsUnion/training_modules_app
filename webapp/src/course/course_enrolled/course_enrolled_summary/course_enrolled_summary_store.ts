import {AppGetter, TypedAction, VuexModuleConfig} from "@store/store_types";
import Vue from 'vue';
import {CourseEnrolledSummaryView} from "@shared/course_progress_summary";
import {Mutation} from "vuex";
import {loadCourseProgressSummary} from '@course/course_enrolled/course_enrolled_summary/course_enrolled_summary_requests';

export interface CourseProgressSummaryState {
    summaries: { [courseId: string]: CourseEnrolledSummaryView }
    requests: { [courseId: string]: boolean }
}

export interface CourseProgressSummaryAccessors {
    currentCourseProgressSummary: CourseEnrolledSummaryView
    currentCourseProgressSummaryLoading: boolean;
}


type CourseProgressSummaryGetters = {[index in keyof CourseProgressSummaryAccessors]: AppGetter<CourseProgressSummaryState>} ;

export const courseProgressSummaryGetters: CourseProgressSummaryGetters = {
    currentCourseProgressSummary: ({summaries}, getters, {course: {currentCourseId: id}}) => summaries[id],
    currentCourseProgressSummaryLoading: ({requests}, getters, {course: {currentCourseId: id}}) => requests[id]
};

export enum COURSE_PROGRESS_SUMMARY_MUTATIONS {
    SET_COURSE_PROGRESS_SUMMARY = 'SET_COURSE_PROGRESS_SUMMARY',
    ADD_REQUEST = 'ADD_REQUEST',
    REMOVE_REQUEST = 'REMOVE_REQUEST'
}

type CourseProgressSummaryMutation<P> = (state: CourseProgressSummaryState, payload: P) => any
    & Mutation<CourseProgressSummaryState>;

export type CourseProgressSummaryMutations = {[index in COURSE_PROGRESS_SUMMARY_MUTATIONS]} & {
    SET_COURSE_PROGRESS_SUMMARY: CourseProgressSummaryMutation<CourseEnrolledSummaryView>,
    ADD_REQUEST: CourseProgressSummaryMutation<string>, // course id
    REMOVE_REQUEST: CourseProgressSummaryMutation<string> // course id
}

export const courseProgressSummaryMutations: CourseProgressSummaryMutations = {
    SET_COURSE_PROGRESS_SUMMARY ({summaries}, payload) {
        Vue.set(summaries, payload.id, payload);
    },
    ADD_REQUEST ({requests}, courseId: string) {
        Vue.set(requests, courseId, true);
    },
    REMOVE_REQUEST ({requests}, courseId: string) {
        Vue.delete(requests, courseId);
    }
};

export const enum COURSE_PROGRESS_SUMMARY_ACTIONS {
    LOAD_COURSE_PROGRESS_SUMMARY = 'LOAD_COURSE_PROGRESS_SUMMARY'
}

type CourseProgressSummaryAction<P, V> = TypedAction<CourseProgressSummaryState, P, V>;
type CourseProgressSummaryActions = {[index in COURSE_PROGRESS_SUMMARY_ACTIONS]} & {
    LOAD_COURSE_PROGRESS_SUMMARY: CourseProgressSummaryAction<string, void>
}

export const courseProgressSummaryActions: CourseProgressSummaryActions = {
    async LOAD_COURSE_PROGRESS_SUMMARY ({commit, state}, courseId: string) {
        if (state.requests[courseId] || state.summaries[courseId]) {
            return; // loading or already loaded
        }

        commit(COURSE_PROGRESS_SUMMARY_MUTATIONS.ADD_REQUEST, courseId);
        let courseProgressSummary = await loadCourseProgressSummary(courseId);
        commit(COURSE_PROGRESS_SUMMARY_MUTATIONS.REMOVE_REQUEST, courseId);
        commit(COURSE_PROGRESS_SUMMARY_MUTATIONS.SET_COURSE_PROGRESS_SUMMARY, courseProgressSummary);
    }
};

export type CourseProgressSummaryConfig = VuexModuleConfig<CourseProgressSummaryState,
    CourseProgressSummaryGetters, CourseProgressSummaryActions, CourseProgressSummaryMutations>;
export const courseProgressSummaryConfig: CourseProgressSummaryConfig = {
    initState (): CourseProgressSummaryState {
        return {
            requests: {},
            summaries: {}
        };
    },
    module () {
        return {
            actions: courseProgressSummaryActions,
            mutations: courseProgressSummaryMutations,
            state: this.initState(),
            getters: courseProgressSummaryGetters
        };
    }
};
