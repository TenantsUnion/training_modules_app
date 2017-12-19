import {Mutation, MutationTree} from 'vuex';
import {ModuleEntity} from '../../../../../../shared/modules';
import {ModuleState} from './module_state';
import Vue from 'vue';
import {Constant} from '../../../../../../shared/typings/util_typings';

export type ModuleMutation<P> = (state: ModuleState, payload: P) => any | Mutation<ModuleState>;
export interface ModuleMutations {
    SET_CURRENT_MODULE: ModuleMutation<String>;
    SET_MODULE_REQUEST_STAGE: ModuleMutation<{id: string; requesting: boolean}>
    SET_MODULE_ENTITY: ModuleMutation<ModuleEntity>;
}

/**
 * Const for using course mutation type values
 */
export const MODULE_MUTATIONS: Constant<ModuleMutations> = {
    SET_CURRENT_MODULE: 'SET_CURRENT_MODULE',
    SET_MODULE_REQUEST_STAGE: 'SET_MODULE_REQUEST_STAGE',
    SET_MODULE_ENTITY: 'SET_MODULE_ENTITY'
};


/**
 * Store mutations
 */
export const moduleMutations: ModuleMutations & MutationTree<ModuleState>= {
    SET_CURRENT_MODULE: (state: ModuleState, moduleId: string) => {
        //todo enforce quill data has been populated??
        state.currentModuleId = moduleId;
    },
    SET_MODULE_REQUEST_STAGE: (state: ModuleState, {id, requesting}) => {
        Vue.set(state.moduleRequests, id, requesting);

    },
    SET_MODULE_ENTITY: (state: ModuleState, module: ModuleEntity) => {
        Vue.set(state.modules, module.id, module);
    }

};
