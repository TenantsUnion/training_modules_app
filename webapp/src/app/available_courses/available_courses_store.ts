import {CourseDescription} from "@shared/courses";
import {Action, ActionContext, ActionTree, Mutation, MutationTree} from "vuex";
import {Constant} from "@shared/typings/util_typings";
import {AppGetter, RootState} from "../state_store";
import {getAvailableCourses} from "./available_courses_requests";
import {courseSlugToIdMap, determineSlugs} from "@global/course_description_util";

export interface AvailableCoursesState {
    courses: CourseDescription[];
    slugToIdMap: { [p: string]: string };
    loaded: boolean;
    loading: boolean;
}

export const initAvailableCoursesState = {
    courses: [],
    loading: false,
    loaded: false,
    slugToIdMap: {}
};

export interface AvailableCoursesGetters {
    getAvailableCourseIdFromSlug: (slug: string) => string;
}

export const availableCoursesGetters: {[p in keyof AvailableCoursesGetters]: AppGetter<AvailableCoursesState>} = {
    getAvailableCourseIdFromSlug ({slugToIdMap}) {
        return (slug: string) => slugToIdMap[slug];
    }
};

export type AvailableCoursesMutation<P> = (state: AvailableCoursesState, payload: P) => any | Mutation<AvailableCoursesState>;

export interface AvailableCoursesMutations {
    SET_COURSES: AvailableCoursesMutation<CourseDescription[]>;
    CLEAR_COURSES: AvailableCoursesMutation<void>
    SET_LOADING: AvailableCoursesMutation<boolean>;
    SET_LOADED: AvailableCoursesMutation<boolean>;
}

export const AVAILABLE_COURSES_MUTATIONS: Constant<AvailableCoursesMutations> = {
    SET_COURSES: 'SET_COURSES',
    CLEAR_COURSES: 'CLEAR_COURSES',
    SET_LOADING: 'SET_LOADING',
    SET_LOADED: 'SET_LOADED'
};

export const availableCoursesMutations: AvailableCoursesMutations & MutationTree<AvailableCoursesState> = {
    SET_COURSES (state: AvailableCoursesState, courses: CourseDescription[]) {
        state.slugToIdMap = courseSlugToIdMap(courses);
        state.courses = determineSlugs(courses);
    },
    CLEAR_COURSES (state: AvailableCoursesState) {
        state.slugToIdMap = {};
        state.courses = [];
        state.loaded = false;
    },
    SET_LOADING (state: AvailableCoursesState, loading: boolean) {
        state.loading = loading;
    },
    SET_LOADED (state: AvailableCoursesState, loading: boolean) {
        state.loaded = loading;
    },
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
        if (state.loaded || state.loading) {
            return;
        }

        let availableCoursesAsync = getAvailableCourses();
        commit(AVAILABLE_COURSES_MUTATIONS.SET_LOADING, true);
        commit(AVAILABLE_COURSES_MUTATIONS.SET_COURSES, await availableCoursesAsync);
        commit(AVAILABLE_COURSES_MUTATIONS.SET_LOADING, false);
        commit(AVAILABLE_COURSES_MUTATIONS.SET_LOADED, true);
    }
};
