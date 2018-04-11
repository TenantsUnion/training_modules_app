import {TrainingType, TrainingView} from "@shared/training";
import {ActionContext, ActionTree, GetterTree} from "vuex";
import {RootGetters, RootState, TypedAction, VuexModuleConfig} from "@store/store_types";
import Vue from "vue";
import {idType} from "@shared/ids";
import {viewsHttpService} from "@webapp/views/views_http_service";

/**
 * Training Store is responsible for maintaining the loading, caching, and maintaining
 * training views {@link TrainingView} of course, module, and section trainings for admins to edit content/questions
 * or enrolled users to be able to view content and answer questions.
 */

export interface TrainingState {
    currentTrainingId: string;
    trainings: { [id: string]: TrainingView }
    requests: { [id: string]: boolean }
}

export interface TrainingAccessors {
    currentTraining: TrainingView;
    currentTrainingType: TrainingType
    trainingLoading: boolean;
}

export type TrainingGetter<V> = (state: TrainingState, getters: RootGetters, rootState: RootState, rootGetters: RootGetters) => V

export type TrainingGetters = GetterTree<TrainingState, RootState> & {
    currentTraining: TrainingGetter<TrainingView>;
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
    SET_TRAINING: TrainingMutation<TrainingView>;
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
    SET_TRAINING({trainings}, training) {
        Vue.set(trainings, training.id, training);
    },
    ADD_TRAINING_REQUEST({requests}, id) {
        Vue.set(requests, id, true);
    },
    REMOVE_TRAINING_REQUEST({requests}, id) {
        Vue.delete(requests, id);
    },
    SET_CURRENT_TRAINING(state, id) {
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
    async SET_CURRENT_COURSE_TRAINING(context, id) {
        await loadTrainingAction(async () => {
            let {courseTraining} = (await viewsHttpService.loadViews({courseTraining: true, courseId: id}));
            return <TrainingView>{
                ...courseTraining,
                trainingType: TrainingType.COURSE,
                subTrainingsLabel: 'Modules',
                subTrainings: courseTraining.modules.map((module) => {
                    return {
                        ...module,
                        trainingType: TrainingType.MODULE,
                        subTrainingsLabel: 'Sections',
                        subTrainings: module.sections.map((section) => {
                            return {
                                ...section,
                                trainingType: TrainingType.SECTION
                            };
                        })
                    }
                })
            }
        })(context, id);
    },
    async SET_CURRENT_MODULE_TRAINING(context, id) {
        await loadTrainingAction(async () => {
            let {moduleTraining} = (await viewsHttpService.loadViews({moduleTraining: true, moduleId: id}));
            return {
                ...moduleTraining,
                trainingType: TrainingType.MODULE,
                subTrainingsLabel: 'Sections',
                subTrainings: moduleTraining.sections.map((section) => {
                    return {
                        ...section,
                        trainingType: TrainingType.SECTION
                    }
                })
            };
        })(context, id);
    },
    async SET_CURRENT_SECTION_TRAINING(context, id) {
        await loadTrainingAction(async () => {
            let {sectionTraining} = (await viewsHttpService.loadViews({sectionTraining: true, sectionId: id}));
            return {
                ...sectionTraining,
                trainingType: TrainingType.SECTION
            }
        })(context, id);
    }
};

const loadTrainingAction = (loadRequest: () => Promise<TrainingView>): TrainingAction<string, void> => {
    return async ({state, commit}: ActionContext<TrainingState, RootState>, id: string) => {
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
    initState() {
        return {
            trainings: {},
            currentTrainingId: null,
            requests: {}
        };
    },
    module() {
        return {
            state: this.initState(),
            actions: trainingActions,
            getters: trainingGetters,
            mutations: trainingMutations
        };
    }
};
