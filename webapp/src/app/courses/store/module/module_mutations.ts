import {MutationType} from 'store.ts';
import {Mutation, MutationTree} from 'vuex';
import {ModuleEntity} from '../../../../../../shared/modules';
import {ModuleState} from './module_state';
import Vue from 'vue';

export interface MODULE_MUTATIONS {
    SET_CURRENT_MODULE: 'SET_CURRENT_MODULE',

    [index: string]: keyof MODULE_MUTATIONS
}

export type ModuleMutation = MutationType<ModuleState, ModuleEntity> | Mutation<ModuleState>;
export type ModuleMutationTree = MutationTree<ModuleState> & { [index in keyof MODULE_MUTATIONS]: ModuleMutation }

/**
 * Const for using course mutation type values
 */
export const MODULE_MUTATIONS: MODULE_MUTATIONS = {
    SET_CURRENT_MODULE: 'SET_CURRENT_MODULE',
};

export interface ModuleMutations extends ModuleMutationTree {
    SET_CURRENT_MODULE: ModuleMutation;
}

/**
 * Store mutations
 */
export const moduleMutations: ModuleMutations = {
    SET_CURRENT_MODULE: (state: ModuleState, module: ModuleEntity) => {
        //todo enforce quill data has been populated??
        state.currentModuleId = module.id;
        Vue.set(state.modules, module.id, module);
    }
};
