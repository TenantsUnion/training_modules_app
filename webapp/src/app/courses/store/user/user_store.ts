import {Action, ActionContext, ActionTree, Mutation, MutationTree} from 'vuex';
import {RootState} from '../../../state_store';
import {Constant} from '@shared/typings/util_typings';
import {IUserInfo} from '@shared/user';
import {accountHttpService} from '../../../account/account_http_service';
import {USER_COURSES_LISTING_ACTIONS, USER_COURSES_LISTING_MUTATIONS} from '../courses_listing/courses_listing_store';


/**
 * State
 */
export interface UserState {
    userId: string;
    username: string;
    loggedIn: boolean;
    userInfo: IUserInfo;
}

export const userState: UserState = {
    userId: '',
    username: '',
    loggedIn: false,
    // change with Vue.set since new properties will be set... or init as new object?
    userInfo: null,
};

/**
 * Mutations
 */
// todo document/figure out how to access/use these commit mutations from component, within action handler, other mutation, same/different modules
export type UserMutation<P> = (state: UserState, payload: P) => any | Mutation<UserState>;

export interface UserMutations {
    USER_LOGIN: UserMutation<IUserInfo>,
    USER_LOGOUT: UserMutation<any>,
}

export const USER_MUTATIONS: Constant<UserMutations> = {
    USER_LOGIN: 'USER_LOGIN',
    USER_LOGOUT: 'USER_LOGOUT',
};

export const userMutations: UserMutations & MutationTree<UserState> = {
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

export interface UserActions {
    LOGIN: UserAction<{ username: string }>,
    LOAD_INFO_FROM_USER_SESSION: UserAction<string>,
    LOGOUT: UserAction<any>,
    SIGNUP: UserAction<{ username: string }>
}

export const USER_ACTIONS: Constant<UserActions> = {
    LOGIN: 'LOGIN',
    LOAD_INFO_FROM_USER_SESSION: 'LOAD_INFO_FROM_USER_SESSION',
    LOGOUT: 'LOGOUT',
    SIGNUP: 'SIGNUP'
};

export const userActions: UserActions & ActionTree<UserState, RootState> = {
    async LOGIN ({commit, dispatch}, {username}) {
        try {
            let userInfo = await accountHttpService.login({
                username: username,
                password: ''
            });
            commit(USER_MUTATIONS.USER_LOGIN, userInfo);
            dispatch(USER_COURSES_LISTING_ACTIONS.LOAD_USER_ADMIN_COURSES);
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
        await dispatch(USER_COURSES_LISTING_ACTIONS.LOAD_USER_ADMIN_COURSES);
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
            await dispatch(USER_COURSES_LISTING_ACTIONS.LOAD_USER_ADMIN_COURSES);
        }
    },
    async LOGOUT ({commit, state, rootState}) {
        await accountHttpService.logout();
        commit(USER_MUTATIONS.USER_LOGOUT);
        commit(USER_COURSES_LISTING_MUTATIONS.CLEAR_USER_COURSES_LISTINGS);
    }
};
