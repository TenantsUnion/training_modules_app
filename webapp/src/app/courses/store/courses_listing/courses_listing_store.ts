import Vue from 'vue';
import * as _ from 'underscore';
import {AdminCourseDescription} from '../../../../../../shared/courses';
import {Action, ActionContext, ActionTree, GetterTree, Mutation, MutationTree} from 'vuex';
import {AppGetter, RootGetters, RootState} from '../../../state_store';
import {Constant} from '../../../../../../shared/typings/util_typings';
import {userCoursesHttpService} from '../../../user/courses/course_http_service';
import {titleToSlug} from '../../../../../../shared/slug/title_slug_transformations';

/**
 * State
 */
export interface UserCoursesListingState {
    adminCourseDescriptions: AdminCourseDescription[];
    courseSlugIdMap: { [index: string]: string };
    courseListingsLoaded: Promise<any>
    loading: boolean;
}

export const userCoursesListingState: UserCoursesListingState = {
    // change with Vue.set since new properties will be set... or init as new object?
    adminCourseDescriptions: [],
    courseSlugIdMap: {},
    courseListingsLoaded: null,
    loading: false
};

/**
 * Getters
 */

export interface UserCoursesListingGetters {
    getCourseIdFromSlug: (slug) => string;
    getSlugFromCourseId: (courseId) => string;
}

export const userCoursesListingGetters: {[index in keyof UserCoursesListingGetters]: AppGetter<UserCoursesListingState>} = {
    getCourseIdFromSlug(state, getters, rootState, rootGetters) {
        return function (slug) {
            return state.courseSlugIdMap[slug];
        }
    },
    getSlugFromCourseId({courseSlugIdMap}, getters: RootGetters) {
        let courseIdSlugMap = Object.keys(courseSlugIdMap).reduce((acc, slug) => {
            acc[slug] = courseSlugIdMap[slug];
            return acc;
        }, {});

        return function (courseId) {
            return courseIdSlugMap[courseId];
        }
    }
};

/**
 * Mutations
 */
export type UserCoursesListingMutation<P> = (state: UserCoursesListingState, payload: P) => any | Mutation<UserCoursesListingState>;

export interface UserCoursesListingMutations {
    SET_ADMIN_COURSE_DESCRIPTIONS: UserCoursesListingMutation<AdminCourseDescription[]>,
    SET_ADMIN_COURSE_DESCRIPTIONS_LOADING: UserCoursesListingMutation<boolean>,
    SET_USER_COURSES_LISTINGS_LOADED: UserCoursesListingMutation<Promise<any>>,
    CLEAR_USER_COURSES_LISTINGS: UserCoursesListingMutation<any>
}

export const USER_COURSES_LISTING_MUTATIONS: Constant<UserCoursesListingMutations> = {
    SET_ADMIN_COURSE_DESCRIPTIONS: 'SET_ADMIN_COURSE_DESCRIPTIONS',
    SET_ADMIN_COURSE_DESCRIPTIONS_LOADING: 'SET_ADMIN_COURSE_DESCRIPTIONS_LOADING',
    SET_USER_COURSES_LISTINGS_LOADED: 'SET_USER_COURSES_LISTINGS_LOADED',
    CLEAR_USER_COURSES_LISTINGS: 'CLEAR_USER_COURSES_LISTINGS'
};

export const userCoursesListingMutations: UserCoursesListingMutations & MutationTree<UserCoursesListingState> = {
    SET_ADMIN_COURSE_DESCRIPTIONS(state: UserCoursesListingState, adminCourseDescriptions: AdminCourseDescription[]) {
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
    SET_ADMIN_COURSE_DESCRIPTIONS_LOADING(state: UserCoursesListingState, loading: boolean) {
        state.loading = loading;
    },
    SET_USER_COURSES_LISTINGS_LOADED(state: UserCoursesListingState, coursesListing: Promise<any>) {
        Vue.set(state, 'courseListingsLoaded', coursesListing);
    },
    CLEAR_USER_COURSES_LISTINGS(state: UserCoursesListingState) {
        state.courseListingsLoaded = null;
        state.loading = false;
        state.adminCourseDescriptions = [];
    }
};

/**
 * Actions
 */
export type UserCoursesListingAction<P> = (context: ActionContext<UserCoursesListingState, RootState>, payload: P) => Promise<any>
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

        let courseListinsLoaded = userCoursesHttpService.getUserAdminCourses(rootState.user.username);
        commit(USER_COURSES_LISTING_MUTATIONS.SET_ADMIN_COURSE_DESCRIPTIONS_LOADING, true);
        commit(USER_COURSES_LISTING_MUTATIONS.SET_USER_COURSES_LISTINGS_LOADED, courseListinsLoaded);
        commit(USER_COURSES_LISTING_MUTATIONS.SET_ADMIN_COURSE_DESCRIPTIONS_LOADING, false);
        commit(USER_COURSES_LISTING_MUTATIONS.SET_ADMIN_COURSE_DESCRIPTIONS, await courseListinsLoaded);
    }
};
