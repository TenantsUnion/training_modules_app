import {Mutation} from 'vuex';
import {ModuleState} from './module_state';
import Vue from 'vue';
import {ViewTrainingEntityDescription} from "@shared/training_entity";

export type ModuleMutation<P> = (state: ModuleState, payload: P) => any & Mutation<ModuleState>;

export type ModuleMutations = {[index in MODULE_MUTATIONS]: ModuleMutation<any>} & {
    SET_CURRENT_MODULE: ModuleMutation<String>;
    SET_MODULE_REQUEST_STAGE: ModuleMutation<{ id: string; requesting: boolean }>;
    SET_MODULE_SECTION_DESCRIPTIONS: ModuleMutation<{ moduleId: string, moduleSectionDescriptions: ViewTrainingEntityDescription[] }>;
}

/**
 * Const for using module mutation type values
 */
export enum MODULE_MUTATIONS {
    SET_CURRENT_MODULE = 'SET_CURRENT_MODULE',
    SET_MODULE_REQUEST_STAGE = 'SET_MODULE_REQUEST_STAGE',
    SET_MODULE_SECTION_DESCRIPTIONS = 'SET_MODULE_SECTION_DESCRIPTIONS'
};

/**
 * Store mutations
 */
export const moduleMutations: ModuleMutations = {
    SET_CURRENT_MODULE: (state: ModuleState, moduleId: string) => {
        state.currentModuleId = moduleId;
    },
    SET_MODULE_REQUEST_STAGE: (state: ModuleState, {id, requesting}) => {
        Vue.set(state.moduleRequests, id, requesting);
    },
    SET_MODULE_SECTION_DESCRIPTIONS: (state: ModuleState, descriptionData) => {
        let viewModule = state.modules[descriptionData.moduleId];
        viewModule.sections = descriptionData.moduleSectionDescriptions;
        Vue.set(state.modules, module.id, module);
    }
};
