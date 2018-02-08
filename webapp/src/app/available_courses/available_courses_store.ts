import {CourseDescription} from "@shared/courses";
import {Action, ActionContext, ActionTree, Mutation, MutationTree} from "vuex";
import {Constant} from "@shared/typings/util_typings";
import {RootState} from "../state_store";
import {getAvailableCourses} from "./available_courses_requests";

export interface AvailableCoursesState {
    courses: CourseDescription[];
    loading: boolean;
}

export const initAvailableCoursesState = {
    courses: null,
    loading: false
};

export type AvailableCoursesMutation<P> = (state: AvailableCoursesState, payload: P) => any | Mutation<AvailableCoursesState>;

export interface AvailableCoursesMutations {
    SET_COURSES: AvailableCoursesMutation<CourseDescription[]>;
    SET_LOADING: AvailableCoursesMutation<boolean>;
}

export const AVAILABLE_COURSES_MUTATIONS: Constant<AvailableCoursesMutations> = {
    SET_COURSES: 'SET_COURSES',
    SET_LOADING: 'SET_LOADING'
};

export const availableCoursesMutations: AvailableCoursesMutations & MutationTree<AvailableCoursesState> = {
    SET_COURSES (state: AvailableCoursesState, courses: CourseDescription[]) {
        state.courses = courses;
    },
    SET_LOADING (state: AvailableCoursesState, loading: boolean) {
        state.loading = loading;
    }
};

export type AvailableCoursesAction<P> =
    (context: ActionContext<AvailableCoursesState, RootState>, payload: P) => Promise<any>
        | Action<AvailableCoursesState, RootState>;

export interface AvailableCoursesActions {
    LOAD_AVAILABLE_COURSES: AvailableCoursesAction<void>
}

export const AVAILABLE_COURSES_ACTIONS: Constant<AvailableCoursesActions> = {
    LOAD_AVAILABLE_COURSES: 'LOAD_AVAILABLE_COURSES'
};

export const availableCoursesActions: AvailableCoursesActions & ActionTree<AvailableCoursesState, RootState> = {
    async LOAD_AVAILABLE_COURSES ({commit, state, rootState}) {
        if (state.courses || state.loading) {
            return;
        }

        let availableCoursesAsync = getAvailableCourses();
        commit(AVAILABLE_COURSES_MUTATIONS.SET_LOADING, true);
        commit(AVAILABLE_COURSES_MUTATIONS.SET_COURSES, await availableCoursesAsync);
        commit(AVAILABLE_COURSES_MUTATIONS.SET_LOADING, false);
    }
};