import {RootState, TypedAction} from "../state_store";
import {
    CourseTrainingProgressUpdate, ModuleTrainingProgressUpdate, SectionTrainingProgressUpdate, TrainingProgressUpdate,
    TrainingProgressUpdateData, TrainingProgressUpdateType
} from "@shared/user_progress";
import {ActionTree, GetterTree, Mutation, MutationTree} from "vuex";
import {CourseMode} from "@course/store/course_mutations";
import {saveUserProgress} from "./user_progress_requests";
import {Constant} from "@shared/typings/util_typings";
import Vue from 'vue';

export interface UserProgressState {
    savingCourseProgress: { [index: string]: TrainingProgressUpdate[] };
    savingModuleProgress: { [index: string]: TrainingProgressUpdate[] };
    savingSectionProgress: { [index: string]: TrainingProgressUpdate[] };
    saveSuccess: boolean;
}

export const userProgressState: UserProgressState = {
    savingCourseProgress: {},
    savingModuleProgress: {},
    savingSectionProgress: {},
    saveSuccess: false
};

export interface UserProgressGetters {
    savingUserProgress: boolean;
}

export const userProgressGetters: {[index in keyof UserProgressGetters]} & GetterTree<UserProgressState, RootState> = {
    savingUserProgress ({savingCourseProgress, savingModuleProgress, savingSectionProgress}: UserProgressState): boolean {
        return !!(Object.keys(savingCourseProgress).length || Object.keys(savingModuleProgress).length
            || Object.keys(savingSectionProgress).length);
    }
};

export type UserProgressMutation<P> = Mutation<UserProgressState> & ((state: UserProgressState, payload: P) => void);

export interface UserProgressMutations extends MutationTree<UserProgressState> {
    SET_SAVE_SUCCESS: UserProgressMutation<boolean>;
    ADD_SAVING_COURSE_PROGRESS: UserProgressMutation<TrainingProgressUpdate>;
    ADD_SAVING_MODULE_PROGRESS: UserProgressMutation<TrainingProgressUpdate>;
    ADD_SAVING_SECTION_PROGRESS: UserProgressMutation<TrainingProgressUpdate>;
    REMOVE_SAVING_COURSE_PROGRESS: UserProgressMutation<TrainingProgressUpdate>;
    REMOVE_SAVING_MODULE_PROGRESS: UserProgressMutation<TrainingProgressUpdate>;
    REMOVE_SAVING_SECTION_PROGRESS: UserProgressMutation<TrainingProgressUpdate>;
}

export const USER_PROGRESS_MUTATIONS: Constant<UserProgressMutations> = {
    SET_SAVE_SUCCESS: 'SET_SAVE_SUCCESS',
    ADD_SAVING_COURSE_PROGRESS: 'ADD_SAVING_COURSE_PROGRESS',
    ADD_SAVING_MODULE_PROGRESS: 'ADD_SAVING_MODULE_PROGRESS',
    ADD_SAVING_SECTION_PROGRESS: 'ADD_SAVING_SECTION_PROGRESS',
    REMOVE_SAVING_COURSE_PROGRESS: 'REMOVE_SAVING_COURSE_PROGRESS',
    REMOVE_SAVING_MODULE_PROGRESS: 'REMOVE_SAVING_MODULE_PROGRESS',
    REMOVE_SAVING_SECTION_PROGRESS: 'REMOVE_SAVING_SECTION_PROGRESS'
};
export const userProgressMutations: UserProgressMutations = {
    SET_SAVE_SUCCESS (state, success: boolean) {
        state.saveSuccess = success;
    },
    ADD_SAVING_COURSE_PROGRESS ({savingCourseProgress}, update: CourseTrainingProgressUpdate) {
        let savingProgress = savingCourseProgress[update.id] ? savingCourseProgress.push(update) : [update];
        Vue.set(savingCourseProgress, update.id, savingProgress);
    },
    ADD_SAVING_MODULE_PROGRESS ({savingModuleProgress}, update: ModuleTrainingProgressUpdate) {
        let savingProgress = savingModuleProgress[update.id] ? savingModuleProgress.push(update) : [update];
        Vue.set(savingModuleProgress, update.id, savingProgress);
    },
    ADD_SAVING_SECTION_PROGRESS ({savingSectionProgress}, update: SectionTrainingProgressUpdate) {
        let savingProgress = savingSectionProgress[update.id] ? savingSectionProgress.push(update) : [update];
        Vue.set(savingSectionProgress, update.id, savingProgress);
    },
    REMOVE_SAVING_COURSE_PROGRESS ({savingCourseProgress}, update: CourseTrainingProgressUpdate) {
        let saving = savingCourseProgress[update.id];
        let index = saving.indexOf(update);
        saving.splice(index, 0);
        Vue.set(savingCourseProgress, update.id, saving.length ? saving : undefined);
    },
    REMOVE_SAVING_MODULE_PROGRESS ({savingModuleProgress}, update: ModuleTrainingProgressUpdate) {
        let saving = savingModuleProgress[update.id];
        let index = saving.indexOf(update);
        saving.splice(index, 0);
        Vue.set(savingModuleProgress, update.id, saving.length ? saving : undefined);
    },
    REMOVE_SAVING_SECTION_PROGRESS ({savingSectionProgress}, update: SectionTrainingProgressUpdate) {
        let saving = savingSectionProgress[update.id];
        let index = saving.indexOf(update);
        saving.splice(index, 0);
        Vue.set(savingSectionProgress, update.id, saving.length ? saving : undefined);
    }
};

type UserProgressAction<P, V> = TypedAction<UserProgressState, P, V>

export interface UserProgressActions extends ActionTree<UserProgressState, RootState> {
    SAVE_COURSE_PROGRESS: UserProgressAction<TrainingProgressUpdateData, void>;
    SAVE_MODULE_PROGRESS: UserProgressAction<TrainingProgressUpdateData, void>;
    SAVE_SECTION_PROGRESS: UserProgressAction<ModuleTrainingProgressUpdate, void>;
    LOAD_USER_PROGRESS: UserProgressAction<{ courseId: string, userId: string }, void>;
}

export const USER_PROGRESS_ACTIONS: Constant<UserProgressActions> = {
    SAVE_COURSE_PROGRESS: 'SAVE_COURSE_PROGRESS',
    SAVE_MODULE_PROGRESS: 'SAVE_MODULE_PROGRESS',
    SAVE_SECTION_PROGRESS: 'SAVE_SECTION_PROGRESS',
    LOAD_USER_PROGRESS: 'LOAD_USER_PROGRESS'
};

export const userProgressActions: UserProgressActions = {
    async SAVE_COURSE_PROGRESS ({rootState, commit}, update: TrainingProgressUpdateData) {
        if (rootState.course.mode !== CourseMode.ENROLLED || !rootState.user.loggedIn) {
            return; // don't record progress in preview or admin mode
        }
        let courseProgress: CourseTrainingProgressUpdate = {
            ...update,
            userId: rootState.user.userId, type: TrainingProgressUpdateType.COURSE,
        };
        commit(USER_PROGRESS_MUTATIONS.ADD_SAVING_COURSE_PROGRESS, courseProgress);
        await saveUserProgress(courseProgress);
        commit(USER_PROGRESS_MUTATIONS.REMOVE_SAVING_COURSE_PROGRESS, courseProgress);
    },
    async SAVE_MODULE_PROGRESS ({rootState, commit}, update: TrainingProgressUpdateData) {
        if (rootState.course.mode !== CourseMode.ENROLLED || !rootState.user.loggedIn) {
            return; // don't record progress in preview or admin mode
        }
        let moduleProgress: ModuleTrainingProgressUpdate = {
            ...update,
            userId: rootState.user.userId, type: TrainingProgressUpdateType.MODULE,
        };
        commit(USER_PROGRESS_MUTATIONS.ADD_SAVING_MODULE_PROGRESS, moduleProgress);
        await saveUserProgress(moduleProgress);
        commit(USER_PROGRESS_MUTATIONS.REMOVE_SAVING_MODULE_PROGRESS, moduleProgress);
    },
    async SAVE_SECTION_PROGRESS ({rootState, commit}, update: TrainingProgressUpdateData) {
        if (rootState.course.mode !== CourseMode.ENROLLED || !rootState.user.loggedIn) {
            return; // don't record progress in preview or admin mode
        }
        let sectionProgress: SectionTrainingProgressUpdate = {
            ...update,
            userId: rootState.user.userId, type: TrainingProgressUpdateType.SECTION,
        };
        commit(USER_PROGRESS_MUTATIONS.ADD_SAVING_SECTION_PROGRESS, sectionProgress);
        await saveUserProgress(sectionProgress);
        commit(USER_PROGRESS_MUTATIONS.REMOVE_SAVING_SECTION_PROGRESS, sectionProgress);
    },
    async LOAD_USER_PROGRESS ({rootState}, {courseId, userId}) {

    }
};