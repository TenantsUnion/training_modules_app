import {Mutation, MutationTree} from 'vuex';
import {ModuleEntity} from '../../../../../../shared/modules';
import {ModuleState} from './module_state';
import Vue from 'vue';
import {Constant} from '../../../../../../shared/typings/util_typings';

export type ModuleMutation<P> = (state: ModuleState, payload: P) => any | Mutation<ModuleState>;
export interface ModuleMutations {
    SET_CURRENT_MODULE: ModuleMutation<ModuleEntity>;
    [key: string]: Mutation<ModuleState>;
}

/**
 * Const for using course mutation type values
 */
export const MODULE_MUTATIONS: Constant<ModuleMutations> = {
    SET_CURRENT_MODULE: 'SET_CURRENT_MODULE',
};


/**
 * Store mutations
 */
export const moduleMutations: ModuleMutations & MutationTree<ModuleState>= {
    SET_CURRENT_MODULE: (state: ModuleState, module: ModuleEntity) => {
        //todo enforce quill data has been populated??
        state.currentModuleId = module.id;
        Vue.set(state.modules, module.id, module);
    }
};
