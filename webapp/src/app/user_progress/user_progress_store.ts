import {
    CourseTrainingProgressUpdate, ModuleTrainingProgressUpdate, SectionTrainingProgressUpdate, TrainingProgressUpdate,
    TrainingProgressUpdateData, TrainingProgressUpdateType, UserCourseProgressView
} from "@shared/user_progress";
import {GetterTree, Mutation} from "vuex";
import {loadUserProgress, saveUserProgress} from "./user_progress_requests";
import Vue from 'vue';
import {RootState, TypedAction, VuexModule, VuexModuleConfig} from "@webapp_root/store";
import {CourseMode} from "@course/course_store";

export interface UserProgressState {
    savingProgress: { [index: string]: TrainingProgressUpdate[] };
    saveSuccess: boolean;
    progressRequests: { [courseId: string]: boolean }
    courseProgressMap: { [courseId: string]: UserCourseProgressView }
}

export const userProgressState: UserProgressState = {
    savingProgress: {},
    saveSuccess: false,
    progressRequests: {},
    courseProgressMap: {},
};

export interface UserProgressAccessors {
    savingUserProgress: boolean;
    loadingCourseProgress: boolean;
}

export type UserProgressGetters = {[index in keyof UserProgressAccessors]} & GetterTree<UserProgressState, RootState>;

export const userProgressGetters: UserProgressGetters = {
    savingUserProgress ({savingProgress}: UserProgressState): boolean {
        return !!Object.keys(savingProgress).length;
    },
    loadingCourseProgress ({progressRequests}: UserProgressState, getters, {course: {currentCourseId}}: RootState) {
        return progressRequests[currentCourseId];
    }
};

export type UserProgressMutation<P> = ((state: UserProgressState, payload: P) => void) & Mutation<UserProgressState>;

export type UserProgressMutations = {[index in USER_PROGRESS_MUTATIONS]: UserProgressMutation<any>} & {
    SET_SAVE_SUCCESS: UserProgressMutation<boolean>;
    ADD_SAVING_PROGRESS: UserProgressMutation<TrainingProgressUpdate>;
    REMOVE_SAVING_PROGRESS: UserProgressMutation<TrainingProgressUpdate>;
    SET_COURSE_PROGRESS: UserProgressMutation<UserCourseProgressView>;
    ADD_COURSE_PROGRESS_REQUEST: UserProgressMutation<string>
    REMOVE_COURSE_PROGRESS_REQUEST: UserProgressMutation<string>
}

export enum USER_PROGRESS_MUTATIONS {
    SET_SAVE_SUCCESS = 'SET_SAVE_SUCCESS',
    ADD_SAVING_PROGRESS = 'ADD_SAVING_PROGRESS',
    REMOVE_SAVING_PROGRESS = 'REMOVE_SAVING_PROGRESS',
    SET_COURSE_PROGRESS = 'SET_COURSE_PROGRESS',
    ADD_COURSE_PROGRESS_REQUEST = 'ADD_COURSE_PROGRESS_REQUEST',
    REMOVE_COURSE_PROGRESS_REQUEST = 'REMOVE_COURSE_PROGRESS_REQUEST'
};

export const userProgressMutations: UserProgressMutations = {
    SET_SAVE_SUCCESS (state, success: boolean) {
        state.saveSuccess = success;
    },
    ADD_SAVING_PROGRESS ({savingProgress}: UserProgressState, update: TrainingProgressUpdate) {
        let requests = savingProgress[update.id] ? [...savingProgress[update.id], update] : [update];
        Vue.set(savingProgress, update.id, requests);
    },
    REMOVE_SAVING_PROGRESS ({savingProgress}: UserProgressState, update: TrainingProgressUpdate) {
        let requests = savingProgress[update.id];
        let index = requests.indexOf(update);
        requests.splice(index, 1);
        // if there are no more requests delete training(course/module/section) id from requests object
        requests.length ? Vue.set(savingProgress, update.id, requests) : Vue.delete(savingProgress, update.id);
    },
    SET_COURSE_PROGRESS ({courseProgressMap}: UserProgressState, courseProgress: UserCourseProgressView) {
        Vue.set(courseProgressMap, courseProgress.id, courseProgress);
    },
    ADD_COURSE_PROGRESS_REQUEST ({progressRequests}: UserProgressState, courseId: string) {
        Vue.set(progressRequests, courseId, true);
    },
    REMOVE_COURSE_PROGRESS_REQUEST ({progressRequests}: UserProgressState, courseId: string) {
        Vue.delete(progressRequests, courseId);
    }
};

type UserProgressAction<P, V> = TypedAction<UserProgressState, P, V>

export type UserProgressActions = {[index in USER_PROGRESS_ACTIONS]: UserProgressAction<any, any>} & {
    SAVE_COURSE_PROGRESS: UserProgressAction<CourseTrainingProgressUpdate, void>;
    SAVE_MODULE_PROGRESS: UserProgressAction<ModuleTrainingProgressUpdate, void>;
    SAVE_SECTION_PROGRESS: UserProgressAction<SectionTrainingProgressUpdate, void>;
    LOAD_USER_PROGRESS: UserProgressAction<string, void>;
}

export enum USER_PROGRESS_ACTIONS {
    SAVE_COURSE_PROGRESS = 'SAVE_COURSE_PROGRESS',
    SAVE_MODULE_PROGRESS = 'SAVE_MODULE_PROGRESS',
    SAVE_SECTION_PROGRESS = 'SAVE_SECTION_PROGRESS',
    LOAD_USER_PROGRESS = 'LOAD_USER_PROGRESS'
}

export const userProgressActions: UserProgressActions = {
    async SAVE_COURSE_PROGRESS ({rootState, rootGetters, commit}, update: TrainingProgressUpdateData) {
        if (rootGetters.currentCourseMode !== CourseMode.ENROLLED || !rootState.user.loggedIn) {
            return; // don't record progress in preview or admin mode
        }
        let courseProgress: CourseTrainingProgressUpdate = {
            ...update,
            userId: rootState.user.userId, type: TrainingProgressUpdateType.COURSE,
        };
        commit(USER_PROGRESS_MUTATIONS.ADD_SAVING_PROGRESS, courseProgress);
        await saveUserProgress(courseProgress);
        commit(USER_PROGRESS_MUTATIONS.REMOVE_SAVING_PROGRESS, courseProgress);
    },
    async SAVE_MODULE_PROGRESS ({rootState, commit, rootGetters}, update: TrainingProgressUpdateData) {
        if (rootGetters.currentCourseMode !== CourseMode.ENROLLED || !rootState.user.loggedIn) {
            return; // don't record progress in preview or admin mode
        }
        let moduleProgress: ModuleTrainingProgressUpdate = {
            ...update,
            userId: rootState.user.userId, type: TrainingProgressUpdateType.MODULE,
        };
        commit(USER_PROGRESS_MUTATIONS.ADD_SAVING_PROGRESS, moduleProgress);
        await saveUserProgress(moduleProgress);
        commit(USER_PROGRESS_MUTATIONS.REMOVE_SAVING_PROGRESS, moduleProgress);
    },
    async SAVE_SECTION_PROGRESS ({rootState, commit, rootGetters}, update: TrainingProgressUpdateData) {
        if (rootGetters.currentCourseMode !== CourseMode.ENROLLED || !rootState.user.loggedIn) {
            return; // don't record progress in preview or admin mode
        }
        let sectionProgress: SectionTrainingProgressUpdate = {
            ...update,
            userId: rootState.user.userId, type: TrainingProgressUpdateType.SECTION,
        };
        commit(USER_PROGRESS_MUTATIONS.ADD_SAVING_PROGRESS, sectionProgress);
        await saveUserProgress(sectionProgress);
        commit(USER_PROGRESS_MUTATIONS.REMOVE_SAVING_PROGRESS, sectionProgress);
    },
    async LOAD_USER_PROGRESS ({state: {progressRequests, courseProgressMap}, commit, rootState}, courseId: string) {
        if (!rootState.user.loggedIn) {
            throw new Error('Cannot load course progress when user is not logged in');
        }

        if (progressRequests[courseId] || courseProgressMap[courseId]) {
            return;// already loaded
        }

        commit(USER_PROGRESS_MUTATIONS.SET_COURSE_PROGRESS, await loadUserProgress({
            courseId, userId: rootState.user.userId
        }));
    }
};

export type UserProgressStoreConfig = VuexModuleConfig<UserProgressState, UserProgressGetters, UserProgressActions, UserProgressMutations>;
export const userProgressStoreConfig: UserProgressStoreConfig = {
    initState (): UserProgressState {
        return {
            savingProgress: {},
            saveSuccess: false,
            progressRequests: {},
            courseProgressMap: {},
        };
    },
    module (): VuexModule<UserProgressState, UserProgressActions, UserProgressGetters, UserProgressMutations> {
        return {
            actions: userProgressActions,
            mutations: userProgressMutations,
            getters: userProgressGetters,
            state: this.initState()
        };
    }
};
