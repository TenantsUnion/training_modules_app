import Vue from 'vue';
import * as _ from 'underscore';
import {AdminCourseDescription, EnrolledCourseDescription} from '@shared/courses';
import {Action, ActionContext, ActionTree, Mutation, MutationTree} from 'vuex';
import {AppGetter, RootGetters, RootState, VuexModule, VuexModuleConfig} from '@webapp_root/store';
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

/**
 * Getters
 */
export interface CoursesListingAccessors {
    getCourseIdFromSlug: (slug: string) => string;
    getSlugFromCourseId: (courseId: string) => string;
    getCourseModeFromId: (courseId: string) => CourseMode;
    getCourseModeFromSlug: (slug: string) => CourseMode;
    adminCourseListingMap: { [index: string]: AdminCourseDescription };
    enrolledCourseListingMap: { [index: string]: EnrolledCourseDescription };
    currentCourseMode: CourseMode;
}

export type getCourseIdFromSlugFn = (slug: string) => string;
export type getSlugFromCourseIdFn = (id: string) => string;
export type courseModeFn = (courseId: string) => CourseMode;


export type CoursesListingGetters = {[index in keyof CoursesListingAccessors]: AppGetter<CoursesListingState>};
export const coursesListingGetters: CoursesListingGetters = {
    currentCourseMode (state, getters, {course: {currentCourseId}}, rootGetters): CourseMode {
        if (!currentCourseId || !state.courseListingsLoaded || state.loading) {
            return null;
        }
        return getters.getCourseModeFromId(currentCourseId);
    },
    getCourseIdFromSlug (state, getters, rootState, rootGetters): getCourseIdFromSlugFn {
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
            if (!getters.getSlugFromCourseId(courseId)) {
                return CourseMode.PREVIEW;
            }
            return getters.adminCourseListingMap[courseId] ? CourseMode.ADMIN :
                getters.enrolledCourseListingMap[courseId] ? CourseMode.ENROLLED : CourseMode.PREVIEW;
        }
    },
    getCourseModeFromSlug (state, getters: RootGetters): courseModeFn {
        return function (slug: string) {
            let courseId = getters.getCourseIdFromSlug(slug);
            if (!courseId) {
                // if course id cannot be determine from admin slugs or enrolled slugs -- must be previewing course
                return CourseMode.PREVIEW;
            }
            return getters.getCourseModeFromId(getters.getCourseIdFromSlug(slug));
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

export interface CoursesListingMutations extends MutationTree<CoursesListingState> {
    SET_ADMIN_COURSE_DESCRIPTIONS: CoursesListingMutation<AdminCourseDescription[]>,
    SET_ENROLLED_COURSE_DESCRIPTIONS: CoursesListingMutation<EnrolledCourseDescription[]>,
    SET_COURSE_DESCRIPTIONS_LOADING: CoursesListingMutation<boolean>,
    SET_COURSES_LISTINGS_LOADED: CoursesListingMutation<boolean>,
    CLEAR_COURSES_LISTINGS: CoursesListingMutation<any>
}

export const COURSES_LISTING_MUTATIONS: Constant<CoursesListingMutations> = {
    SET_ADMIN_COURSE_DESCRIPTIONS: 'SET_ADMIN_COURSE_DESCRIPTIONS',
    SET_ENROLLED_COURSE_DESCRIPTIONS: 'SET_ENROLLED_COURSE_DESCRIPTIONS',
    SET_COURSE_DESCRIPTIONS_LOADING: 'SET_COURSE_DESCRIPTIONS_LOADING',
    SET_COURSES_LISTINGS_LOADED: 'SET_COURSES_LISTINGS_LOADED',
    CLEAR_COURSES_LISTINGS: 'CLEAR_COURSES_LISTINGS'
};

const setCourseDescriptions = (state: CoursesListingState, {enrolled, admin}: { enrolled: EnrolledCourseDescription[], admin: AdminCourseDescription[] }) => {
    let uniqueTitle = [...enrolled, ...admin]
        .reduce((acc, {title}: AdminCourseDescription) => {
            acc[title] = _.isUndefined(acc[title]);
            return acc;
        }, {});
    let enrolledDescriptions = enrolled.map((description: AdminCourseDescription) => {
        let {id, title} = description;
        return {slug: titleToSlug(title, !uniqueTitle[title], id), id, title};
    });
    let adminDescriptions = admin.map((description: EnrolledCourseDescription) => {
        let {id, title} = description;
        return {slug: titleToSlug(title, !uniqueTitle[title], id), id, title};
    });
    let courseSlugToMap = enrolledDescriptions.concat(adminDescriptions).reduce((acc, course) => {
        acc[course.slug] = course.id;
        return acc;
    }, {});

    Vue.set(state, 'courseSlugIdMap', courseSlugToMap);
    Vue.set(state, 'adminCourseDescriptions', adminDescriptions);
    Vue.set(state, 'enrolledCourseDescriptions', enrolledDescriptions);
};
export const coursesListingMutations: CoursesListingMutations = {
    SET_ADMIN_COURSE_DESCRIPTIONS (state, adminCourseDescriptions: AdminCourseDescription[]) {
        setCourseDescriptions(state, {admin: adminCourseDescriptions, enrolled: state.enrolledCourseDescriptions});
    },
    SET_ENROLLED_COURSE_DESCRIPTIONS (state: CoursesListingState, incomingDescriptions: EnrolledCourseDescription[]) {
        setCourseDescriptions(state, {admin: state.adminCourseDescriptions, enrolled: incomingDescriptions});
    },
    SET_COURSE_DESCRIPTIONS_LOADING (state: CoursesListingState, loading: boolean) {
        state.loading = loading;
    },
    SET_COURSES_LISTINGS_LOADED (state: CoursesListingState, coursesListing: boolean) {
        Vue.set(state, 'courseListingsLoaded', coursesListing);
    },
    CLEAR_COURSES_LISTINGS (state: CoursesListingState) {
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
        commit(COURSES_LISTING_MUTATIONS.SET_COURSES_LISTINGS_LOADED, false);
        commit(COURSES_LISTING_MUTATIONS.SET_COURSE_DESCRIPTIONS_LOADING, false);
        let courseListing = await userHttpService.loadUserCourses(rootState.user.userId);
        commit(COURSES_LISTING_MUTATIONS.SET_ADMIN_COURSE_DESCRIPTIONS, courseListing.admin);
        commit(COURSES_LISTING_MUTATIONS.SET_ENROLLED_COURSE_DESCRIPTIONS, courseListing.enrolled);
        commit(COURSES_LISTING_MUTATIONS.SET_COURSES_LISTINGS_LOADED, true);
    }
};

export class CoursesListingStoreConfig implements VuexModuleConfig<CoursesListingState, CoursesListingGetters, CoursesListingActions, CoursesListingMutations> {
    initState (): CoursesListingState {
        return {
            adminCourseDescriptions: [],
            enrolledCourseDescriptions: [],
            courseSlugIdMap: {},
            courseListingsLoaded: false,
            loading: false
        };
    }

    module (): VuexModule<CoursesListingState, CoursesListingActions, CoursesListingGetters, CoursesListingMutations> {
        return {
            actions: coursesListingActions,
            getters: coursesListingGetters,
            state: this.initState(),
            mutations: coursesListingMutations
        };
    }

}

export const coursesListingStoreConfig = new CoursesListingStoreConfig();
