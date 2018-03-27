import {ViewTrainingEntity} from "@shared/training_entity";
import {ActionTree, GetterTree} from "vuex";
import {RootGetters, RootState, TypedAction, VuexModuleConfig} from "@store/store_types";
import Vue from "vue";
import {idType} from "@shared/ids";
import {viewsHttpService} from "@webapp/views/views_http_service";

/**
 * Training Store is responsible for maintaining the loading, caching, and maintaining
 * training views {@link ViewTrainingEntity} of course, module, and section trainings for admins to edit content/questions
 * or enrolled users to be able to view content and answer questions.
 */

export interface TrainingState {
    currentTrainingId: string;
    trainings: { [id: string]: ViewTrainingEntity }
    requests: { [id: string]: boolean }
}

export enum TrainingType {
    course = 'COURSE', module = 'MODULE', section = 'SECTION'
}

export interface TrainingAccessors {
    currentTraining: ViewTrainingEntity;
    currentTrainingType: TrainingType
    trainingLoading: boolean;
}

export type TrainingGetter<V> = (state: TrainingState, getters: RootGetters, rootState: RootState, rootGetters: RootGetters) => V

export type TrainingGetters = GetterTree<TrainingState, RootState> & {
    currentTraining: TrainingGetter<ViewTrainingEntity>;
    currentTrainingType: TrainingGetter<TrainingType>;
    trainingLoading: TrainingGetter<boolean>
};

export const trainingGetters: TrainingGetters = {
    currentTraining: ({currentTrainingId, trainings}) => trainings[currentTrainingId],
    currentTrainingType: ({currentTrainingId}) => currentTrainingId ? <TrainingType> idType(currentTrainingId) : null,
    trainingLoading: ({currentTrainingId, requests}) => requests[currentTrainingId],
};

export type TrainingMutation<P> = (state: TrainingState, payload: P) => any;

export type TrainingMutations = {[index in TRAINING_MUTATIONS]: TrainingMutation<any>} & {
    SET_TRAINING: TrainingMutation<ViewTrainingEntity>;
    ADD_TRAINING_REQUEST: TrainingMutation<string>;
    REMOVE_TRAINING_REQUEST: TrainingMutation<string>;
    SET_CURRENT_TRAINING: TrainingMutation<string>;
}

export enum TRAINING_MUTATIONS {
    SET_TRAINING = 'SET_TRAINING',
    ADD_TRAINING_REQUEST = 'ADD_TRAINING_REQUEST',
    REMOVE_TRAINING_REQUEST = 'REMOVE_TRAINING_REQUEST',
    SET_CURRENT_TRAINING = 'SET_CURRENT_TRAINING'
}

export const trainingMutations: TrainingMutations = {
    SET_TRAINING ({trainings}, training) {
        Vue.set(trainings, training.id, training);
    },
    ADD_TRAINING_REQUEST ({requests}, id) {
        Vue.set(requests, id, true);
    },
    REMOVE_TRAINING_REQUEST ({requests}, id) {
        Vue.delete(requests, id);
    },
    SET_CURRENT_TRAINING (state, id) {
        state.currentTrainingId = id;
    }
};

export type TrainingAction<P, V> = TypedAction<TrainingState, P, V>;

export interface TrainingActions extends ActionTree<TrainingState, RootState> {
    SET_CURRENT_COURSE_TRAINING: TrainingAction<string, Promise<void>>;
    SET_CURRENT_MODULE_TRAINING: TrainingAction<string, Promise<void>>;
    SET_CURRENT_SECTION_TRAINING: TrainingAction<string, Promise<void>>;
}

export enum TRAINING_ACTIONS {
    SET_CURRENT_COURSE_TRAINING = 'SET_CURRENT_COURSE_TRAINING',
    SET_CURRENT_MODULE_TRAINING = 'SET_CURRENT_MODULE_TRAINING',
    SET_CURRENT_SECTION_TRAINING = 'SET_CURRENT_SECTION_TRAINING'
}

export const trainingActions: TrainingActions = {
    async SET_CURRENT_COURSE_TRAINING (context, id) {
        await loadTrainingAction(async () => {
            return (await viewsHttpService.loadViews({courseTraining: true, courseId: id})).courseTraining;
        })(context, id);
    },
    async SET_CURRENT_MODULE_TRAINING (context, id) {
        await loadTrainingAction(async () => {
            return (await viewsHttpService.loadViews({moduleTraining: true, moduleId: id})).moduleTraining;
        })(context, id);
    },
    async SET_CURRENT_SECTION_TRAINING (context, id) {
        await loadTrainingAction(async () => {
            return (await viewsHttpService.loadViews({sectionTraining: true, sectionId: id})).sectionTraining;
        })(context, id);
    }
};

const loadTrainingAction = (loadRequest: () => Promise<ViewTrainingEntity>): TrainingAction<string, void> => {
    return async ({state, commit}, id) => {
        let {currentTrainingId, requests, trainings} = state;
        if (currentTrainingId === id) {
            return;// no change
        }

        commit(TRAINING_MUTATIONS.SET_CURRENT_TRAINING, id);
        if (!trainings[id] && !requests[id]) {
            commit(TRAINING_MUTATIONS.ADD_TRAINING_REQUEST, id);
            let result = await loadRequest();
            commit(TRAINING_MUTATIONS.REMOVE_TRAINING_REQUEST, id);
            commit(TRAINING_MUTATIONS.SET_TRAINING, result);
        }
    };
};

export type TrainingStoreConfig = VuexModuleConfig<TrainingState, TrainingGetters, TrainingActions, TrainingMutations>;
export const trainingStoreConfig: TrainingStoreConfig = {
    initState () {
        return {
            trainings: {},
            currentTrainingId: null,
            requests: {}
        };
    },
    module () {
        return {
            state: this.initState(),
            actions: trainingActions,
            getters: trainingGetters,
            mutations: trainingMutations
        };
    }
};
