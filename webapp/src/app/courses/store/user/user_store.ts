import {Action, ActionContext, ActionTree, Mutation, MutationTree} from 'vuex';
import {RootState} from '../../../state_store';
import {Constant} from '../../../../../../shared/typings/util_typings';
import {IUserInfo} from '../../../../../../shared/user';
import {accountHttpService} from '../../../account/account_http_service';
import {USER_COURSES_LISTING_ACTIONS} from '../courses_listing/courses_listing_store';
import {appRouter} from '../../../router';

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
    userInfo: null
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
    USER_LOGIN(state: UserState, info: IUserInfo) {
        state.loggedIn = true;
        state.userInfo = info;
        state.username = info.username;
        state.userId = info.id;
    },
    USER_LOGOUT: (state: UserState) => {
        state.loggedIn = false;
        state.userInfo = null;
        state.username = '';
        state.userId = '';
    },
};

/**
 * Actions
 */
export type UserAction<P> = (context: ActionContext<UserState, RootState>, payload: P) => Promise<any>
    | Action<UserState, RootState>;

export interface UserActions {
    LOGIN: UserAction<{ username: string }>,
    LOAD_INFO_FROM_USER_SESSION: UserAction<any>,
    LOGOUT: UserAction<any>

}

export const USER_ACTIONS: Constant<UserActions> = {
    LOGIN: 'LOGIN',
    LOAD_INFO_FROM_USER_SESSION: 'LOAD_INFO_FROM_USER_SESSION',
    LOGOUT: 'LOGOUT'
};

export const userActions: UserActions & ActionTree<UserState, RootState> = {
    async LOGIN({commit, dispatch}, {username}) {
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
    async LOAD_INFO_FROM_USER_SESSION({dispatch, state, commit}) {
        let username = appRouter.currentRoute.params.username;
        if (!username || state.loggedIn) {
            return;
        }
        let userInfo = await accountHttpService.getLoggedInUserInfo();
        if(userInfo) {
            commit(USER_MUTATIONS.USER_LOGIN, userInfo);
            dispatch(USER_COURSES_LISTING_ACTIONS.LOAD_USER_ADMIN_COURSES);
        } else {
            // todo username is part of route but user is not logged in and there is no user session on the server. should handle by redirecting to home page
        }
    },
    async LOGOUT(context) {

    }
};
