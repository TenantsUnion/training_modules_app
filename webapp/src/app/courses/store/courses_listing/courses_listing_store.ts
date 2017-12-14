import {AdminCourseDescription} from '../../../../../../shared/courses';
import {Action, ActionContext, ActionTree, Mutation, MutationTree} from 'vuex';
import {RootState} from '../../../state_store';
import {Constant} from '../../../../../../shared/typings/util_typings';
import Vue from 'vue';
import {userCoursesHttpService} from '../../../user/courses/course_http_service';

/**
 * State
 */
export interface UserCoursesListingState {
    adminCourseDescriptions: AdminCourseDescription[]
    loading: boolean;
}

export const userCoursesListingState: UserCoursesListingState = {
    // change with Vue.set since new properties will be set... or init as new object?
    adminCourseDescriptions: [],
    loading: false
};

/**
 * Mutations
 */
// todo document/figure out how to access/use these commit mutations from component, within action handler, other mutation, same/different modules
export type UserCoursesListingMutation<P> = (state: UserCoursesListingState, payload: P) => any | Mutation<UserCoursesListingState>;
export interface UserCoursesListingMutations {
    SET_ADMIN_COURSE_DESCRIPTIONS: UserCoursesListingMutation<AdminCourseDescription[]>,
    SET_ADMIN_COURSE_DESCRIPTIONS_LOADING: UserCoursesListingMutation<boolean>
}

export const USER_COURSES_LISTING_MUTATIONS: Constant<UserCoursesListingMutations> = {
    SET_ADMIN_COURSE_DESCRIPTIONS: 'SET_ADMIN_COURSE_DESCRIPTIONS',
    SET_ADMIN_COURSE_DESCRIPTIONS_LOADING: 'SET_ADMIN_COURSE_DESCRIPTIONS_LOADING'
};

export const userCoursesListingMutations: UserCoursesListingMutations & MutationTree<UserCoursesListingState>= {
    SET_ADMIN_COURSE_DESCRIPTIONS: (state: UserCoursesListingState, adminCourseDescriptions: AdminCourseDescription[]) => {
        Vue.set(state, 'adminCourseDescriptions', adminCourseDescriptions);
    },
    SET_ADMIN_COURSE_DESCRIPTIONS_LOADING: (state: UserCoursesListingState, loading: boolean) => {
        state.loading = loading;
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
export const USER_COURSES_LISTING_ACTIONS: Constant<UserCoursesListingActions>= {
    LOAD_USER_ADMIN_COURSES: 'LOAD_USER_ADMIN_COURSES'
};

export const userCoursesListingActions:UserCoursesListingActions & ActionTree<UserCoursesListingState, RootState> = {
    LOAD_USER_ADMIN_COURSES: async ({commit}, payload) => {
        commit(USER_COURSES_LISTING_MUTATIONS.SET_ADMIN_COURSE_DESCRIPTIONS_LOADING, true);
        let userAdminCourseDescriptions = await userCoursesHttpService.getUserAdminCourses();
        commit(USER_COURSES_LISTING_MUTATIONS.SET_ADMIN_COURSE_DESCRIPTIONS_LOADING, false);
        commit(USER_COURSES_LISTING_MUTATIONS.SET_ADMIN_COURSE_DESCRIPTIONS, userAdminCourseDescriptions);
    }
};
