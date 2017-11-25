import axios from 'axios';
import {CreateModuleEntityPayload, ModuleEntity} from '../../../../../../shared/modules';
import {MODULE_MUTATIONS, ModuleMutationTree} from './module_mutations';
import {ActionType, CommitType} from '../../../../../../shared/store';
import {ModuleState} from './module_state';
import {ActionContext, ActionTree} from 'vuex';

export interface MODULE_ACTIONS {
    CREATE_MODULE: CreateModuleAction,
    SET_CURRENT_MODULE: SetCurrentModuleAction;

    [index: string]: ModuleAction<any>;
}

export type ModuleAction<P> = ActionType<ModuleState, any, P>;

export type CreateModuleAction = ModuleAction<CreateModuleEntityPayload>;
export type PopulateModuleQuillDataAction = ModuleAction<ModuleEntity>;
export type SetCurrentModuleAction = ModuleAction<ModuleEntity>;


export type ModuleActionTree = ActionTree<ModuleState, any> & { [index in keyof MODULE_ACTIONS]: ModuleAction<any> }
export type ModuleActionContext =
    ActionContext<ModuleState, any>
    & { commit: CommitType<keyof MODULE_MUTATIONS, ModuleMutationTree> };

/**
 * Const for using course mutation type values
 */
export const MODULE_ACTIONS: {[index in keyof MODULE_ACTIONS]: keyof MODULE_ACTIONS} = {
    CREATE_MODULE: 'CREATE_MODULE',
    SET_CURRENT_MODULE: 'SET_CURRENT_MODULE'
};
/**
 * Module store actions
 */
export const moduleActions: ModuleActionTree = {
    CREATE_MODULE: async (context: ModuleActionContext, course: CreateModuleEntityPayload) => {
        let CREATE_ID = 'CREATING';
        try {
            let request = axios.post('courses/create', course);
            context.commit(MODULE_MUTATIONS.SET_MODULE_REQUEST_STAGE, {id: CREATE_ID, stage: 'WAITING'});
            let currentModuleId = await request;
            context.commit(MODULE_MUTATIONS.SET_MODULE_REQUEST_STAGE, {id: CREATE_ID, stage: 'SUCCESS'});
            await context.dispatch(MODULE_ACTIONS.LOAD_MODULE, {id: currentModuleId});
            await context.commit(MODULE_MUTATIONS.SET_CURRENT_MODULE, {id: currentModuleId});
            // update store state request sent;
            // await -- set store state command sent -- delete from store??
            // set current course to just created course -- update route??
            //

        } catch (response) {
            throw response.response.data;
        }
    },
    SET_CURRENT_MODULE: async (context: ModuleActionContext, payload: { id: string }) => {

        // update course subscription
    }
};
