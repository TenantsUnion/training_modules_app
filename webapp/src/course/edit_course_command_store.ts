import {
    CreateCourseEntityCommand, CreateCourseEntityPayload,
    SaveCourseEntityPayload, SaveCourseResponse
} from '@shared/courses';
import {getCorrelationId} from '@shared/correlation_id_generator';
import {RootState, TypedAction, VuexModule, VuexModuleConfig} from '@store/store_types';
import {COURSES_LISTING_ACTIONS, COURSES_LISTING_MUTATIONS} from '@webapp/user/store/courses_listing_store';
import {TRAINING_MUTATIONS} from "@webapp/training/training_store";
import {CommandType} from "@shared/entity";
import {GetterTree, Mutation} from "vuex";
import Vue from "vue";
import {coursesService} from "@webapp/course/courses_service";
import {COURSE_MUTATIONS} from "@webapp/course/course_store";
import {CreateModuleEntityPayload, SaveModuleEntityPayload} from "@shared/modules";
import {moduleHttpService} from "@webapp/module/modules_requests";
import {CreateSectionEntityPayload, SaveSectionEntityPayload} from "@shared/sections";
import {sectionHttpService} from "@webapp/section/sections_requests";

export interface EditCourseCommandState {
    creatingCourse: boolean;
    creatingModule: boolean;
    creatingSection: boolean;
    saving: { [id: string]: boolean }
}

export type EditCourseCommandMutation<P> = (state: EditCourseCommandState, payload: P) => any | Mutation<EditCourseCommandState>;
export type EditCourseCommandMutations = { [index in EDIT_COURSE_COMMAND_MUTATIONS]} & {
    SET_CREATING_COURSE: EditCourseCommandMutation<boolean>,
    SET_CREATING_MODULE: EditCourseCommandMutation<boolean>,
    SET_CREATING_SECTION: EditCourseCommandMutation<boolean>,
    ADD_SAVING: EditCourseCommandMutation<string>
    REMOVE_SAVING: EditCourseCommandMutation<string>
}

export enum EDIT_COURSE_COMMAND_MUTATIONS {
    SET_CREATING_COURSE = 'SET_CREATING_COURSE',
    SET_CREATING_MODULE = 'SET_CREATING_MODULE',
    SET_CREATING_SECTION = 'SET_CREATING_SECTION',
    ADD_SAVING = 'ADD_SAVING',
    REMOVE_SAVING = 'REMOVE_SAVING'

}

export const editCourseCommandMutations: EditCourseCommandMutations = {
    SET_CREATING_COURSE ({creatingCourse}, creating) {
        creatingCourse = creating;
    },
    SET_CREATING_MODULE ({creatingModule}, creating) {
        creatingModule = creating;
    },
    SET_CREATING_SECTION ({creatingSection}, creating) {
        creatingSection = creating;
    },
    ADD_SAVING ({saving}, id) {
        Vue.set(saving, id, true);
    },
    REMOVE_SAVING ({saving}, id) {
        Vue.delete(saving, id);
    }
};

export type EditCourseCommandAction<P, V> = TypedAction<EditCourseCommandState, P, V>;
export type EditCourseCommandActions = {[index in EDIT_COURSE_COMMAND_ACTIONS]} & {
    /**
     * returns the id of the created course
     */
    CREATE_COURSE: EditCourseCommandAction<CreateCourseEntityPayload, string>,
    SAVE_COURSE: EditCourseCommandAction<SaveCourseEntityPayload, void>;
    /**
     * returns the id of the created module
     */
    CREATE_MODULE: EditCourseCommandAction<CreateModuleEntityPayload, string>,
    SAVE_MODULE: EditCourseCommandAction<SaveModuleEntityPayload, void>;
    /**
     * returns the id of the created section
     */
    CREATE_SECTION: EditCourseCommandAction<CreateSectionEntityPayload, string>,
    SAVE_SECTION: EditCourseCommandAction<SaveSectionEntityPayload, void>;
}

/**
 * Const for using course mutation type values
 */
export enum EDIT_COURSE_COMMAND_ACTIONS {
    CREATE_COURSE = 'CREATE_COURSE',
    SAVE_COURSE = 'SAVE_COURSE',
    CREATE_MODULE = 'CREATE_MODULE',
    SAVE_MODULE = 'SAVE_MODULE',
    CREATE_SECTION = 'CREATE_SECTION',
    SAVE_SECTION = 'SAVE_SECTION',
}

/**
 * Course store actions
 */
export const editCourseCommandActions: EditCourseCommandActions = {
    /**
     * @returns {Promise<string>} the created course id
     */
    async CREATE_COURSE ({commit, dispatch, rootState, state}, coursePayload: CreateCourseEntityPayload): Promise<string> {
        try {
            let createCourseCommand: CreateCourseEntityCommand = {
                metadata: {
                    userId: rootState.user.userId,
                    id: 'NEW',
                    version: 0,
                    type: CommandType.course,
                    timestamp: new Date().toUTCString(),
                    correlationId: getCorrelationId(rootState.user.userId),
                },
                payload: coursePayload
            };
            commit(EDIT_COURSE_COMMAND_MUTATIONS.SET_CREATING_COURSE, true);
            let {courseTraining, courseStructure, adminCourseDescriptions} = await coursesService.createCourse(createCourseCommand);
            commit(EDIT_COURSE_COMMAND_MUTATIONS.SET_CREATING_COURSE, false);

            commit(COURSES_LISTING_MUTATIONS.SET_ADMIN_COURSE_DESCRIPTIONS, adminCourseDescriptions);
            commit(TRAINING_MUTATIONS.SET_TRAINING, courseTraining);
            commit(COURSE_MUTATIONS.SET_COURSE, courseStructure);
            return courseTraining.id;
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    async SAVE_COURSE ({commit, dispatch}, saveCourseEntityPayload: SaveCourseEntityPayload) {
        commit(EDIT_COURSE_COMMAND_MUTATIONS.ADD_SAVING, saveCourseEntityPayload.id);
        try {
            let {courseTraining, courseStructure}: SaveCourseResponse = await coursesService.saveCourse(saveCourseEntityPayload);
            commit(TRAINING_MUTATIONS.SET_TRAINING, courseTraining);
            commit(COURSE_MUTATIONS.SET_COURSE, courseStructure);
            if (saveCourseEntityPayload.changes.title) {
                // title change means slug changed -- reload admin courses to recalculate slug
                commit(COURSES_LISTING_MUTATIONS.SET_COURSES_LISTINGS_LOADED, false);
                await dispatch(COURSES_LISTING_ACTIONS.LOAD_COURSE_LISTINGS);
            }
        } finally {
            commit(EDIT_COURSE_COMMAND_MUTATIONS.REMOVE_SAVING, saveCourseEntityPayload.id);
        }
    },
    CREATE_MODULE: async ({commit, getters}, createModulePayload: CreateModuleEntityPayload) => {
        commit(EDIT_COURSE_COMMAND_MUTATIONS.SET_CREATING_MODULE, true);
        let {courseStructure, moduleId, module} = await moduleHttpService.createModule(createModulePayload);
        commit(EDIT_COURSE_COMMAND_MUTATIONS.SET_CREATING_MODULE, false);

        commit(TRAINING_MUTATIONS.SET_TRAINING, module);
        commit(COURSE_MUTATIONS.SET_COURSE, courseStructure);
        return moduleId;
    },
    async SAVE_MODULE ({commit, dispatch}, saveModuleEntity: SaveModuleEntityPayload) {
        commit(EDIT_COURSE_COMMAND_MUTATIONS.ADD_SAVING, saveModuleEntity.id);
        let {courseStructure, module} = await moduleHttpService.saveModule(saveModuleEntity);
        commit(EDIT_COURSE_COMMAND_MUTATIONS.REMOVE_SAVING, saveModuleEntity.id);

        commit(COURSE_MUTATIONS.SET_COURSE, courseStructure);
        commit(TRAINING_MUTATIONS.SET_TRAINING, module);
    },
    CREATE_SECTION: async ({dispatch, commit, getters, rootState}, createSectionData: CreateSectionEntityPayload) => {
        commit(EDIT_COURSE_COMMAND_MUTATIONS.SET_CREATING_SECTION, true);
        let {sectionId, courseStructure, section} = await sectionHttpService.createSection(createSectionData);
        commit(EDIT_COURSE_COMMAND_MUTATIONS.SET_CREATING_SECTION, false);
        commit(COURSE_MUTATIONS.SET_COURSE, courseStructure);
        commit(TRAINING_MUTATIONS.SET_TRAINING, section);
        return sectionId;
    },
    async SAVE_SECTION ({commit, getters, dispatch, rootState}, saveSectionEntity: SaveSectionEntityPayload) {
        commit(EDIT_COURSE_COMMAND_MUTATIONS.ADD_SAVING, saveSectionEntity.id);
        let {section, courseStructure} = await coursesService.saveSection(saveSectionEntity);
        commit(EDIT_COURSE_COMMAND_MUTATIONS.REMOVE_SAVING, saveSectionEntity.id);
        commit(COURSE_MUTATIONS.SET_COURSE, courseStructure);
        commit(TRAINING_MUTATIONS.SET_TRAINING, section);
    }
};

export type EditCourseCommandStoreConfig = VuexModuleConfig<EditCourseCommandState,
    GetterTree<EditCourseCommandState, RootState>, EditCourseCommandActions, EditCourseCommandMutations>;
export const editCourseCommandStoreConfig: EditCourseCommandStoreConfig = {
    initState (): EditCourseCommandState {
        return {
            creatingCourse: false,
            creatingModule: false,
            creatingSection: false,
            saving: {}
        };
    },
    module (): VuexModule<EditCourseCommandState, EditCourseCommandActions,
        GetterTree<EditCourseCommandState, RootState>, EditCourseCommandMutations> {
        return {
            actions: editCourseCommandActions,
            mutations: editCourseCommandMutations,
            state: this.initState()
        };
    }
};
