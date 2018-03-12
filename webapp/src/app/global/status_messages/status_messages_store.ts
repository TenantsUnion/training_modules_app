import {ActionTree, GetterTree, Mutation, MutationTree} from "vuex";
import {RootState, TypedAction, VuexModuleConfig} from "@webapp_root/store";

export interface StatusMessage {
    title?: string;
    message?: string;
    status: 'ALERT' | 'SUCCESS' | 'WARNING';
}

export interface StatusMessagesState {
    messages: StatusMessage[];
}


export type StatusMessagesMutation<P> = (state: StatusMessagesState, payload: P) => any | Mutation<StatusMessagesState>;

export type StatusMessagesMutations = {[index in STATUS_MESSAGES_MUTATIONS]: StatusMessagesMutation<any>} & {
    PUSH_STATUS_MESSAGE: StatusMessagesMutation<StatusMessage>
    DISMISS_MESSAGE: StatusMessagesMutation<StatusMessage>
}

export enum STATUS_MESSAGES_MUTATIONS {
    PUSH_STATUS_MESSAGE = 'PUSH_STATUS_MESSAGE',
    DISMISS_MESSAGE = 'DISMISS_MESSAGE'
}

export const statusMessagesMutations: StatusMessagesMutations = {
    PUSH_STATUS_MESSAGE (state, message) {
        state.messages = [...state.messages, message];
    },
    DISMISS_MESSAGE (state, message) {
        // has to be same object (not just equal properties) of the message to be dismissed
        let index = state.messages.indexOf(message);
        if (index !== -1) {
            state.messages.splice(index, 1);
            state.messages = [...state.messages];
        }
    }
};

export type StatusMessagesAction<P, V> = TypedAction<StatusMessagesState, P, V>;

export type TitleMessagesObj = { title?: string, message?: string };

export type StatusMessagesActions = {[index in STATUS_MESSAGES_ACTIONS]: StatusMessagesAction<any, any>} & {
    SET_MESSAGE_TIMEOUT_CLEAR: StatusMessagesAction<{ message: StatusMessage, msTimeout: number }, void>;
    // times out and dismissable
    SET_SUCCESS_MESSAGE: StatusMessagesAction<TitleMessagesObj, void>;
    // dismissable
    SET_ALERT_MESSAGE: StatusMessagesAction<TitleMessagesObj, void>;
    // dismissable
    SET_WARNING_MESSAGE: StatusMessagesAction<TitleMessagesObj, void>;
}

export enum STATUS_MESSAGES_ACTIONS {
    SET_MESSAGE_TIMEOUT_CLEAR= 'SET_MESSAGE_TIMEOUT_CLEAR',
    SET_SUCCESS_MESSAGE= 'SET_SUCCESS_MESSAGE',
    SET_ALERT_MESSAGE= 'SET_ALERT_MESSAGE',
    SET_WARNING_MESSAGE= 'SET_WARNING_MESSAGE'
}

export const statusMessageActions: StatusMessagesActions = {
    SET_MESSAGE_TIMEOUT_CLEAR ({commit}, {message, msTimeout}) {
        commit(STATUS_MESSAGES_MUTATIONS.PUSH_STATUS_MESSAGE, message);
        setTimeout(() => commit(STATUS_MESSAGES_MUTATIONS.DISMISS_MESSAGE, message), msTimeout)
    },
    SET_SUCCESS_MESSAGE ({dispatch}, titleMessageObj) {
        let message: StatusMessage = {...titleMessageObj, status: "SUCCESS"};
        dispatch(STATUS_MESSAGES_ACTIONS.SET_MESSAGE_TIMEOUT_CLEAR, {message, msTimeout: 3000})
    },
    SET_ALERT_MESSAGE ({commit}, titleMessageObj) {
        let message: StatusMessage = {...titleMessageObj, status: "ALERT"};
        commit(STATUS_MESSAGES_MUTATIONS.PUSH_STATUS_MESSAGE, message);
    },
    SET_WARNING_MESSAGE ({commit}, titleMessageObj) {
        let message: StatusMessage = {...titleMessageObj, status: "WARNING"};
        commit(STATUS_MESSAGES_MUTATIONS.PUSH_STATUS_MESSAGE, message);
    }
};

export type StatusMessageStoreConfig = VuexModuleConfig<StatusMessagesState,
    GetterTree<StatusMessagesState, RootState>, StatusMessagesActions, StatusMessagesMutations>;
export const statusMessageStoreConfig: StatusMessageStoreConfig = {
    initState (): StatusMessagesState {
        return {
            messages: []
        };
    },
    module () {
        return {
            state: this.initState(),
            actions: statusMessageActions,
            mutations: statusMessagesMutations,
        };
    }
};




