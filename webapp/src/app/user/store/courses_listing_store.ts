import Vue from 'vue';
import * as _ from 'underscore';
import {AdminCourseDescription, CourseDescription, EnrolledCourseDescription} from '@shared/courses';
import {Action, ActionContext, ActionTree, Mutation, MutationTree} from 'vuex';
import {AppGetter, RootGetters, RootState} from '../../state_store';
import {Constant} from '@shared/typings/util_typings';
import {titleToSlug} from '@shared/slug/title_slug_transformations';
import {CourseMode} from "@course/store/course_mutations";
import {userHttpService} from "@user/user_http_service";

/**
 * State
 */
export interface CoursesListingState {
    adminCourseDescriptions: AdminCourseDescription[];
    enrolledCourseDescriptions: EnrolledCourseDescription[];
    courseSlugIdMap: { [index: string]: string };
    courseListingsLoaded: boolean;
    loading: boolean;
}

export const coursesListingState: CoursesListingState = {
    // change with Vue.set since new properties will be set... or init as new object?
    adminCourseDescriptions: [],
    enrolledCourseDescriptions: [],
    courseSlugIdMap: {},
    courseListingsLoaded: false,
    loading: false
};

/**
 * Getters
 */
export interface CoursesListingGetters {
    getUserCourseIdFromSlug: (slug: string) => string;
    getSlugFromCourseId: (courseId: string) => string;
    getCourseModeFromId: (courseId: string) => CourseMode;
    getUserCourseModeFromSlug: (slug: string) => CourseMode;
    adminCourseListingMap: { [index: string]: AdminCourseDescription };
    enrolledCourseListingMap: { [index: string]: EnrolledCourseDescription };
    currentCourseMode: CourseMode;
}

export type getCourseIdFromSlugFn = (slug: string) => string;
export type getSlugFromCourseIdFn = (id: string) => string;
export type courseModeFn = (courseId: string) => CourseMode;


export const coursesListingGetters: {[index in keyof CoursesListingGetters]: AppGetter<CoursesListingState>} = {
    currentCourseMode (state, getters, {course: {currentCourseId}}, rootGetters): CourseMode {
        if (!currentCourseId || !state.courseListingsLoaded || state.loading) {
            return null;
        }
        return getters.getCourseModeFromId(currentCourseId);
    },
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
            return getters.adminCourseListingMap[courseId] ? CourseMode.ADMIN :
                getters.enrolledCourseListingMap[courseId] ? CourseMode.ENROLLED : CourseMode.PREVIEW;
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
    },
    enrolledCourseListingMap (state, getters): { [index: string]: EnrolledCourseDescription } {
        return state.enrolledCourseDescriptions.reduce((acc, desc) => {
            acc[desc.id] = desc;
            return acc;
        }, {});
    }

};
/**
 * Mutations
 */
export type CoursesListingMutation<P> = (state: CoursesListingState, payload: P) => any | Mutation<CoursesListingState>;

export interface CoursesListingMutations {
    SET_ADMIN_COURSE_DESCRIPTIONS: CoursesListingMutation<AdminCourseDescription[]>,
    SET_ENROLLED_COURSE_DESCRIPTIONS: CoursesListingMutation<EnrolledCourseDescription[]>,
    SET_COURSE_DESCRIPTIONS_LOADING: CoursesListingMutation<boolean>,
    SET_USER_COURSES_LISTINGS_LOADED: CoursesListingMutation<boolean>,
    CLEAR_USER_COURSES_LISTINGS: CoursesListingMutation<any>
}

export const COURSES_LISTING_MUTATIONS: Constant<CoursesListingMutations> = {
    SET_ADMIN_COURSE_DESCRIPTIONS: 'SET_ADMIN_COURSE_DESCRIPTIONS',
    SET_ENROLLED_COURSE_DESCRIPTIONS: 'SET_ENROLLED_COURSE_DESCRIPTIONS',
    SET_COURSE_DESCRIPTIONS_LOADING: 'SET_COURSE_DESCRIPTIONS_LOADING',
    SET_USER_COURSES_LISTINGS_LOADED: 'SET_USER_COURSES_LISTINGS_LOADED',
    CLEAR_USER_COURSES_LISTINGS: 'CLEAR_USER_COURSES_LISTINGS'
};

export const coursesListingMutations: CoursesListingMutations & MutationTree<CoursesListingState> = {
    SET_ADMIN_COURSE_DESCRIPTIONS (state, adminCourseDescriptions: AdminCourseDescription[]) {
        let uniqueTitle = adminCourseDescriptions.concat(state.enrolledCourseDescriptions)
            .reduce((acc, {title}: AdminCourseDescription) => {
                acc[title] = _.isUndefined(acc[title]);
                return acc;
            }, {});
        let adminCourses: CourseDescription[] = adminCourseDescriptions.map((description: AdminCourseDescription) => {
            let {id, title} = description;
            return {slug: titleToSlug(title, !uniqueTitle[title], id), ...description};
        });
        let courseSlugToMap = adminCourses.concat(state.enrolledCourseDescriptions).reduce((acc, course) => {
            acc[course.slug] = course.id;
            return acc;
        }, {});

        Vue.set(state, 'courseSlugIdMap', courseSlugToMap);
        Vue.set(state, 'adminCourseDescriptions', adminCourses);
    },
    SET_ENROLLED_COURSE_DESCRIPTIONS (state: CoursesListingState, incomingDescriptions: EnrolledCourseDescription[]) {
        let uniqueTitle = incomingDescriptions.concat(state.adminCourseDescriptions)
            .reduce((acc, {title}: AdminCourseDescription) => {
                acc[title] = _.isUndefined(acc[title]);
                return acc;
            }, {});
        let enrolledDescriptions: CourseDescription[] = incomingDescriptions.map((description: AdminCourseDescription) => {
            let {id, title} = description;
            return {slug: titleToSlug(title, !uniqueTitle[title], id), ...description};
        });
        let courseSlugToMap = enrolledDescriptions.concat(state.adminCourseDescriptions).reduce((acc, course) => {
            acc[course.slug] = course.id;
            return acc;
        }, {});

        Vue.set(state, 'courseSlugIdMap', courseSlugToMap);
        Vue.set(state, 'enrolledCourseDescriptions', enrolledDescriptions);
    },
    SET_COURSE_DESCRIPTIONS_LOADING (state: CoursesListingState, loading: boolean) {
        state.loading = loading;
    },
    SET_USER_COURSES_LISTINGS_LOADED (state: CoursesListingState, coursesListing: boolean) {
        Vue.set(state, 'courseListingsLoaded', coursesListing);
    },
    CLEAR_USER_COURSES_LISTINGS (state: CoursesListingState) {
        state.courseListingsLoaded = null;
        state.loading = false;
        state.adminCourseDescriptions = [];
        state.enrolledCourseDescriptions = [];
    }
};

/**
 * Actions
 */
export type UserCoursesListingAction<P> =
    (context: ActionContext<CoursesListingState, RootState>, payload?: P) => Promise<any>
        | Action<CoursesListingState, RootState>;

export interface CoursesListingActions extends ActionTree<CoursesListingState, RootState> {
    LOAD_COURSE_LISTINGS: UserCoursesListingAction<Promise<void>>
}

export const COURSES_LISTING_ACTIONS: Constant<CoursesListingActions> = {
    LOAD_COURSE_LISTINGS: 'LOAD_COURSE_LISTINGS'
};

export const coursesListingActions: CoursesListingActions = {
    LOAD_COURSE_LISTINGS: async ({commit, state, rootState}) => {
        if (state.courseListingsLoaded || !rootState.user.loggedIn || state.loading) {
            return;
        }

        commit(COURSES_LISTING_MUTATIONS.SET_COURSE_DESCRIPTIONS_LOADING, true);
        commit(COURSES_LISTING_MUTATIONS.SET_USER_COURSES_LISTINGS_LOADED, false);
        commit(COURSES_LISTING_MUTATIONS.SET_COURSE_DESCRIPTIONS_LOADING, false);
        let courseListing = await userHttpService.loadUserCourses(rootState.user.userId);
        commit(COURSES_LISTING_MUTATIONS.SET_ADMIN_COURSE_DESCRIPTIONS, courseListing.admin);
        commit(COURSES_LISTING_MUTATIONS.SET_ENROLLED_COURSE_DESCRIPTIONS, courseListing.enrolled);
        commit(COURSES_LISTING_MUTATIONS.SET_USER_COURSES_LISTINGS_LOADED, true);
    }
};
