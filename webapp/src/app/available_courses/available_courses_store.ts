import {CourseDescription} from "@shared/courses";
import {Action, ActionContext, ActionTree, Mutation, MutationTree} from "vuex";
import {getAvailableCourses} from "./available_courses_requests";
import {courseSlugToIdMap, determineSlugs} from "@global/course_description_util";
import {AppGetter, RootState, VuexModule, VuexModuleConfig} from "@webapp_root/store";

export interface AvailableCoursesState {
    courses: CourseDescription[];
    slugToIdMap: { [p: string]: string };
    loaded: boolean;
    loading: boolean;
}

export interface AvailableCoursesAccessors {
    getAvailableCourseIdFromSlug: (slug: string) => string;
}


type  AvailableCoursesGetters = {[p in keyof AvailableCoursesAccessors]: AppGetter<AvailableCoursesState>};
export const availableCoursesGetters: AvailableCoursesGetters = {
    getAvailableCourseIdFromSlug ({slugToIdMap}) {
        return (slug: string) => slugToIdMap[slug];
    }
};

export type AvailableCoursesMutation<P> = (state: AvailableCoursesState, payload: P) => any | Mutation<AvailableCoursesState>;

export type AvailableCoursesMutations = {[index in AVAILABLE_COURSES_MUTATIONS]: AvailableCoursesMutation<any>} & {
    SET_COURSES: AvailableCoursesMutation<CourseDescription[]>;
    CLEAR_COURSES: AvailableCoursesMutation<void>
    SET_LOADING: AvailableCoursesMutation<boolean>;
    SET_LOADED: AvailableCoursesMutation<boolean>;
}

export enum AVAILABLE_COURSES_MUTATIONS {
    SET_COURSES = 'SET_COURSES',
    CLEAR_COURSES = 'CLEAR_COURSES',
    SET_LOADING = 'SET_LOADING',
    SET_LOADED = 'SET_LOADED'
};

export const availableCoursesMutations: AvailableCoursesMutations = {
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

export type AvailableCoursesActions = {[index in AVAILABLE_COURSES_ACTIONS]: AvailableCoursesAction<any>} & {
    LOAD_AVAILABLE_COURSES: AvailableCoursesAction<void>
}

export enum AVAILABLE_COURSES_ACTIONS {
    LOAD_AVAILABLE_COURSES = 'LOAD_AVAILABLE_COURSES'
}

export const availableCoursesActions: AvailableCoursesActions = {
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

export type AvailableCoursesStoreConfig = VuexModuleConfig<AvailableCoursesState, AvailableCoursesGetters,
    AvailableCoursesActions, AvailableCoursesMutations>
export const availableCoursesStoreConfig: AvailableCoursesStoreConfig = {
    initState (): AvailableCoursesState {
        return {
            courses: [],
            loading: false,
            loaded: false,
            slugToIdMap: {}
        };
    },
    module (): VuexModule<AvailableCoursesState, AvailableCoursesActions,
        AvailableCoursesGetters, AvailableCoursesMutations> {
        return {
            mutations: availableCoursesMutations,
            actions: availableCoursesActions,
            getters: availableCoursesGetters,
            state: this.initState()
        };
    }
};
