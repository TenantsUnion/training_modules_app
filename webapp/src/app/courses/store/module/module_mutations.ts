import {Mutation, MutationTree} from 'vuex';
import {ModuleEntity} from '../../../../../../shared/modules';
import {ModuleState} from './module_state';
import Vue from 'vue';
import {Constant} from '../../../../../../shared/typings/util_typings';
import {TrainingEntity, ViewTrainingEntityDescription} from "@shared/training_entity";

export type ModuleMutation<P> = (state: ModuleState, payload: P) => any & Mutation<ModuleState>;
export interface ModuleMutations {
    SET_CURRENT_MODULE: ModuleMutation<String>;
    SET_MODULE_REQUEST_STAGE: ModuleMutation<{id: string; requesting: boolean}>
    SET_MODULE_ENTITY: ModuleMutation<ModuleEntity>;
    SET_MODULE_SECTION_DESCRIPTIONS: ModuleMutation<{moduleId: string, moduleSectionDescriptions: ViewTrainingEntityDescription[]}>;
}

/**
 * Const for using module mutation type values
 */
export const MODULE_MUTATIONS: Constant<ModuleMutations> = {
    SET_CURRENT_MODULE: 'SET_CURRENT_MODULE',
    SET_MODULE_REQUEST_STAGE: 'SET_MODULE_REQUEST_STAGE',
    SET_MODULE_ENTITY: 'SET_MODULE_ENTITY',
    SET_MODULE_SECTION_DESCRIPTIONS: 'SET_MODULE_SECTION_DESCRIPTIONS'
};


/**
 * Store mutations
 */
export const moduleMutations: ModuleMutations & MutationTree<ModuleState>= {
    SET_CURRENT_MODULE: (state: ModuleState, moduleId: string) => {
        state.currentModuleId = moduleId;
    },
    SET_MODULE_REQUEST_STAGE: (state: ModuleState, {id, requesting}) => {
        Vue.set(state.moduleRequests, id, requesting);

    },
    SET_MODULE_ENTITY: (state: ModuleState, module: ModuleEntity) => {
        Vue.set(state.modules, module.id, module);
    },
    SET_MODULE_SECTION_DESCRIPTIONS: (state: ModuleState, descriptionData) => {
        let viewModule = state.modules[descriptionData.moduleId];
        viewModule.sections = descriptionData.moduleSectionDescriptions;
        Vue.set(state.modules, module.id, module);
    }


};
