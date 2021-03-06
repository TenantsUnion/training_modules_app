import {Action, ActionContext, GetterTree, Mutation} from 'vuex';
import {RootState, VuexModule, VuexModuleConfig} from '@store/store_types';
import {IUserInfo} from '@shared/user';
import {COURSES_LISTING_ACTIONS, COURSES_LISTING_MUTATIONS} from './courses_listing_store';
import {userHttpService} from "@webapp/user/user_http_service";
import {AVAILABLE_COURSES_MUTATIONS} from "@webapp/available_courses/available_courses_store";
import {accountHttpService} from "@webapp/account/account_http_service";


/**
 * State
 */
export interface UserState {
    userId: string;
    username: string;
    loggedIn: boolean;
    userInfo: IUserInfo;
}


/**
 * Mutations
 */
export type UserMutation<P> = (state: UserState, payload: P) => any | Mutation<UserState>;

export type UserMutations = {[index in USER_MUTATIONS]: UserMutation<any>} & {
    USER_LOGIN: UserMutation<IUserInfo>,
    USER_LOGOUT: UserMutation<any>,
}

export enum USER_MUTATIONS {
    USER_LOGIN = 'USER_LOGIN',
    USER_LOGOUT = 'USER_LOGOUT',
};

export const userMutations: UserMutations = {
    USER_LOGIN (state: UserState, info: IUserInfo) {
        state.loggedIn = true;
        state.userInfo = info;
        state.username = info.username;
        state.userId = info.id;
    },
    USER_LOGOUT (state: UserState) {
        state.loggedIn = false;
        state.userInfo = null;
        state.username = '';
        state.userId = '';
    }
};

/**
 * Actions
 */
export type UserAction<P> = (context: ActionContext<UserState, RootState>, payload: P) => Promise<any>
    | Action<UserState, RootState>;

export type UserActions = {[index in USER_ACTIONS]: UserAction<any>} & {
    LOGIN: UserAction<{ username: string }>,
    LOAD_INFO_FROM_USER_SESSION: UserAction<string>,
    LOGOUT: UserAction<any>,
    SIGNUP: UserAction<{ username: string }>
    ENROLL_IN_COURSE: UserAction<string>;
}

export enum USER_ACTIONS {
    LOGIN = 'LOGIN',
    LOAD_INFO_FROM_USER_SESSION = 'LOAD_INFO_FROM_USER_SESSION',
    LOGOUT = 'LOGOUT',
    SIGNUP = 'SIGNUP',
    ENROLL_IN_COURSE = 'ENROLL_IN_COURSE'
};

export const userActions: UserActions = {
    async LOGIN ({commit, dispatch}, {username}) {
        try {
            let userInfo = await accountHttpService.login({
                username: username,
                password: ''
            });
            commit(USER_MUTATIONS.USER_LOGIN, userInfo);
            dispatch(COURSES_LISTING_ACTIONS.LOAD_COURSE_LISTINGS);
        } catch (e) {
            console.error(e);
        }
    },
    async SIGNUP ({commit, dispatch}, {username}) {
        let userInfo = await accountHttpService.signup({
            username: username,
            password: ''
        });
        commit(USER_MUTATIONS.USER_LOGIN, userInfo);
        await dispatch(COURSES_LISTING_ACTIONS.LOAD_COURSE_LISTINGS);
    },
    async LOAD_INFO_FROM_USER_SESSION ({dispatch, state, commit}, username) {
        if (username === state.username && state.userInfo) {
            return; // no state change
        }

        if (username && state.username && username !== state.username) {
            await dispatch(USER_ACTIONS.LOGOUT);
            return;
        }

        // user session still exists on server if page has just been refreshed
        let userInfo = await accountHttpService.getLoggedInUserInfo(username);
        if (userInfo) {
            commit(USER_MUTATIONS.USER_LOGIN, userInfo);
            await dispatch(COURSES_LISTING_ACTIONS.LOAD_COURSE_LISTINGS);
        }
    },
    async LOGOUT ({commit, state, rootState}) {
        await accountHttpService.logout();
        commit(USER_MUTATIONS.USER_LOGOUT);
        commit(COURSES_LISTING_MUTATIONS.CLEAR_COURSES_LISTINGS);
        commit(AVAILABLE_COURSES_MUTATIONS.CLEAR_COURSES)
    },
    async ENROLL_IN_COURSE ({commit, state, rootState}, courseId: string) {
        let {enrolledCourses, courseProgress} = await userHttpService.enrollUserInCourse({
            courseId,
            userId: state.userId
        });
        commit(COURSES_LISTING_MUTATIONS.SET_ENROLLED_COURSE_DESCRIPTIONS, enrolledCourses);
    }
};

export type UserStoreConfig = VuexModuleConfig<UserState, GetterTree<UserState, RootState>, UserActions, UserMutations>;
export const userStoreConfig: UserStoreConfig = {
    initState (): UserState {
        return {
            userId: '',
            username: '',
            loggedIn: false,
            userInfo: null,
        };
    },
    module (): VuexModule<UserState, UserActions, GetterTree<UserState, RootState>, UserMutations> {
        return {
            actions: userActions,
            mutations: userMutations,
            state: this.initState()
        };
    }

};
