import axios from 'axios';
import {CreateModuleEntityPayload, ModuleEntity} from '../../../../../../shared/modules';
import {MODULE_MUTATIONS} from './module_mutations';
import {ModuleState} from './module_state';
import {Action, ActionContext, ActionTree} from 'vuex';
import {RootState} from '../../../state_store';
import {Constant} from '../../../../../../shared/typings/util_typings';

export interface ModuleActions {
    CREATE_MODULE: CreateModuleAction,
    SET_CURRENT_MODULE: SetCurrentModuleAction;

    [index: string]: ModuleAction<any>;
}

export type ModuleAction<P> = Action<ModuleState, RootState>;

export type CreateModuleAction = ModuleAction<CreateModuleEntityPayload>;
export type PopulateModuleQuillDataAction = ModuleAction<ModuleEntity>;
export type SetCurrentModuleAction = ModuleAction<ModuleEntity>;

/**
 * Const for using course mutation type values
 */
export const MODULE_ACTIONS: Constant<ModuleActions> = {
    CREATE_MODULE: 'CREATE_MODULE',
    SET_CURRENT_MODULE: 'SET_CURRENT_MODULE'
};
/**
 * Module store actions
 */
export const moduleActions: ActionTree<ModuleState, RootState> & ModuleActions = {
    CREATE_MODULE: async (context: ActionContext<ModuleState, RootState>, course: CreateModuleEntityPayload) => {
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
    SET_CURRENT_MODULE: async (context: ActionContext<ModuleState, RootState>, payload: { id: string }) => {

        // update course subscription
    }
};
