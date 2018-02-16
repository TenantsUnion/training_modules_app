import Vue from 'vue';
import * as _ from 'underscore';
import {AdminCourseDescription} from '@shared/courses';
import {Action, ActionContext, ActionTree, Mutation, MutationTree} from 'vuex';
import {AppGetter, RootGetters, RootState} from '../../../state_store';
import {Constant} from '@shared/typings/util_typings';
import {userCoursesHttpService} from '../../../user/courses/course_http_service';
import {titleToSlug} from '@shared/slug/title_slug_transformations';
import {CourseMode} from "../course/course_mutations";

/**
 * State
 */
export interface UserCoursesListingState {
    adminCourseDescriptions: AdminCourseDescription[];
    courseSlugIdMap: { [index: string]: string };
    courseListingsLoaded: boolean;
    loading: boolean;
}

export const userCoursesListingState: UserCoursesListingState = {
    // change with Vue.set since new properties will be set... or init as new object?
    adminCourseDescriptions: [],
    courseSlugIdMap: {},
    courseListingsLoaded: false,
    loading: false
};

/**
 * Getters
 */
export interface UserCoursesListingGetters {
    getUserCourseIdFromSlug: (slug: string) => string;
    getSlugFromCourseId: (courseId: string) => string;
    getCourseModeFromId: (courseId: string) => CourseMode;
    getUserCourseModeFromSlug: (slug: string) => CourseMode;
    adminCourseListingMap: { [index: string]: AdminCourseDescription }
}

export type getCourseIdFromSlugFn = (slug: string) => string;
export type getSlugFromCourseIdFn = (id: string) => string;
export type courseModeFn = (courseId: string) => CourseMode;


export const userCoursesListingGetters: {[index in keyof UserCoursesListingGetters]: AppGetter<UserCoursesListingState>} = {
    getUserCourseIdFromSlug (state, getters, rootState, rootGetters): getCourseIdFromSlugFn {
        return function (slug) {
            return state.courseSlugIdMap[slug];
        }
    },
    getSlugFromCourseId ({courseSlugIdMap}, getters: RootGetters): getSlugFromCourseIdFn {
        let courseIdSlugMap = Object.keys(courseSlugIdMap).reduce((acc, slug) => {
            acc[courseSlugIdMap[slug]] = slug;
            return acc;
        }, {});

        return function (courseId) {
            return courseIdSlugMap[courseId];
        }
    },
    getCourseModeFromId (state, getters): courseModeFn {
        return function (courseId: string): CourseMode {
            return getters.adminCourseListingMap[courseId] ? CourseMode.ADMIN : CourseMode.ENROLLED;
        }
    },
    getUserCourseModeFromSlug (state, getters: RootGetters): courseModeFn {
        return function (slug: string) {
            let courseId = getters.getUserCourseIdFromSlug(slug);
            // if course id cannot be determine from admin slugs or enrolled slugs -- must be previewing course
            return courseId ? getters.getCourseModeFromId(getters.getUserCourseIdFromSlug(slug)) : CourseMode.PREVIEW;
        }
    },
    adminCourseListingMap (state, getters): { [index: string]: AdminCourseDescription } {
        return state.adminCourseDescriptions.reduce((acc, desc) => {
            acc[desc.id] = desc;
            return acc;
        }, {});
    }

};
/**
 * Mutations
 */
export type UserCoursesListingMutation<P> = (state: UserCoursesListingState, payload: P) => any | Mutation<UserCoursesListingState>;

export interface UserCoursesListingMutations {
    SET_ADMIN_COURSE_DESCRIPTIONS: UserCoursesListingMutation<AdminCourseDescription[]>,
    SET_ADMIN_COURSE_DESCRIPTIONS_LOADING: UserCoursesListingMutation<boolean>,
    SET_USER_COURSES_LISTINGS_LOADED: UserCoursesListingMutation<boolean>,
    CLEAR_USER_COURSES_LISTINGS: UserCoursesListingMutation<any>
}

export const USER_COURSES_LISTING_MUTATIONS: Constant<UserCoursesListingMutations> = {
    SET_ADMIN_COURSE_DESCRIPTIONS: 'SET_ADMIN_COURSE_DESCRIPTIONS',
    SET_ADMIN_COURSE_DESCRIPTIONS_LOADING: 'SET_ADMIN_COURSE_DESCRIPTIONS_LOADING',
    SET_USER_COURSES_LISTINGS_LOADED: 'SET_USER_COURSES_LISTINGS_LOADED',
    CLEAR_USER_COURSES_LISTINGS: 'CLEAR_USER_COURSES_LISTINGS'
};

export const userCoursesListingMutations: UserCoursesListingMutations & MutationTree<UserCoursesListingState> = {
    SET_ADMIN_COURSE_DESCRIPTIONS (state: UserCoursesListingState, adminCourseDescriptions: AdminCourseDescription[]) {
        let uniqueTitle = adminCourseDescriptions.reduce((acc, {title}: AdminCourseDescription) => {
            acc[title] = _.isUndefined(acc[title]);
            return acc;
        }, {});
        let adminCourses = adminCourseDescriptions.map((description: AdminCourseDescription) => {
            let {id, title} = description;
            return {
                slug: titleToSlug(title, !uniqueTitle[title], id),
                ...description
            };
        });
        let courseSlugToMap = adminCourses.reduce((acc, course) => {
            acc[course.slug] = course.id;
            return acc;
        }, {});

        Vue.set(state, 'courseSlugIdMap', courseSlugToMap);
        Vue.set(state, 'adminCourseDescriptions', adminCourses);
    },
    SET_ADMIN_COURSE_DESCRIPTIONS_LOADING (state: UserCoursesListingState, loading: boolean) {
        state.loading = loading;
    },
    SET_USER_COURSES_LISTINGS_LOADED (state: UserCoursesListingState, coursesListing: boolean) {
        Vue.set(state, 'courseListingsLoaded', coursesListing);
    },
    CLEAR_USER_COURSES_LISTINGS (state: UserCoursesListingState) {
        state.courseListingsLoaded = null;
        state.loading = false;
        state.adminCourseDescriptions = [];
    }
};

/**
 * Actions
 */
export type UserCoursesListingAction<P> =
    (context: ActionContext<UserCoursesListingState, RootState>, payload: P) => Promise<any>
        | Action<UserCoursesListingState, RootState>;

export interface UserCoursesListingActions {
    LOAD_USER_ADMIN_COURSES: UserCoursesListingAction<void>
}

export const USER_COURSES_LISTING_ACTIONS: Constant<UserCoursesListingActions> = {
    LOAD_USER_ADMIN_COURSES: 'LOAD_USER_ADMIN_COURSES'
};

export const userCoursesListingActions: UserCoursesListingActions & ActionTree<UserCoursesListingState, RootState> = {
    LOAD_USER_ADMIN_COURSES: async ({commit, state, rootState}) => {
        if (state.courseListingsLoaded || !rootState.user.loggedIn || state.loading) {
            return;
        }

        let courseListingLoaded = userCoursesHttpService.getUserAdminCourses(rootState.user.userId);
        commit(USER_COURSES_LISTING_MUTATIONS.SET_ADMIN_COURSE_DESCRIPTIONS_LOADING, true);
        commit(USER_COURSES_LISTING_MUTATIONS.SET_USER_COURSES_LISTINGS_LOADED, false);
        commit(USER_COURSES_LISTING_MUTATIONS.SET_ADMIN_COURSE_DESCRIPTIONS_LOADING, false);
        commit(USER_COURSES_LISTING_MUTATIONS.SET_ADMIN_COURSE_DESCRIPTIONS, await courseListingLoaded);
        commit(USER_COURSES_LISTING_MUTATIONS.SET_USER_COURSES_LISTINGS_LOADED, true);
    }
};
