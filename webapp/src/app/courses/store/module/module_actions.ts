import axios from 'axios';
import {CreateModuleEntityPayload, CreateModuleResponse, ModuleEntity} from '../../../../../../shared/modules';
import {MODULE_MUTATIONS} from './module_mutations';
import {ModuleState} from './module_state';
import {Action, ActionContext, ActionTree} from 'vuex';
import {RootGetters, RootState} from '../../../state_store';
import {Constant} from '../../../../../../shared/typings/util_typings';
import {coursesService} from '../../courses_service';
import {transformTransferViewService} from '../../../global/quill/transform_transfer_view_service';
import {COURSE_MUTATIONS} from '../course/course_mutations';

export interface ModuleActions {
    CREATE_MODULE: CreateModuleAction,
    SET_CURRENT_MODULE: SetCurrentModuleAction;
    SET_CURRENT_MODULE_FROM_SLUG: SetCurrentModuleFromSlugAction;
}

export type ModuleAction<P> = Action<ModuleState, RootState>;

export type CreateModuleAction = ModuleAction<CreateModuleEntityPayload>;
export type PopulateModuleQuillDataAction = ModuleAction<ModuleEntity>;
export type SetCurrentModuleAction = ModuleAction<ModuleEntity>;
export type LoadModuleAction = ModuleAction<{ courseId: string, moduleId: string }>
export type SetCurrentModuleFromSlugAction = ModuleAction<{ slug: string, isAdmin: boolean }>

/**
 * Const for using course mutation type values
 */
export const MODULE_ACTIONS: Constant<ModuleActions> = {
    CREATE_MODULE: 'CREATE_MODULE',
    SET_CURRENT_MODULE: 'SET_CURRENT_MODULE',
    SET_CURRENT_MODULE_FROM_SLUG: 'SET_CURRENT_MODULE_FROM_SLUG'
};

export const CREATE_ID = 'CREATING';
/**
 * Module store actions
 */
export const moduleActions: ActionTree<ModuleState, RootState> & ModuleActions = {
    CREATE_MODULE: async ({commit}, createModule: CreateModuleEntityPayload) => {
        commit(MODULE_MUTATIONS.SET_MODULE_REQUEST_STAGE, {id: CREATE_ID, requesting: true});
        let {course, moduleId} = await coursesService.createModule(createModule);
        commit(MODULE_MUTATIONS.SET_MODULE_REQUEST_STAGE, {id: CREATE_ID, requesting: false});
        let module = course.modules.find((module) => module.id === moduleId);

        commit(MODULE_MUTATIONS.SET_MODULE_ENTITY, await transformTransferViewService.populateTrainingEntityQuillData(module));
        commit(MODULE_MUTATIONS.SET_CURRENT_MODULE, moduleId);
        commit(COURSE_MUTATIONS.SET_COURSE_ENTITY, course);
    },
    async SET_CURRENT_MODULE({state, getters, commit}, id) {
        try {
            if (id === state.currentModuleId) {
                // provided id matches id of current module, no changes to state needed
                return;
            }

            commit(MODULE_MUTATIONS.SET_CURRENT_MODULE, id);
            if (!getters.currentModuleLoaded) {
                commit(MODULE_MUTATIONS.SET_MODULE_REQUEST_STAGE, {id, requesting: true});
                let moduleTransferData = getters.getModuleTransferData(id);
                let moduleEntity = await transformTransferViewService.populateTrainingEntityQuillData(moduleTransferData);
                commit(MODULE_MUTATIONS.SET_MODULE_REQUEST_STAGE, {id, requesting: false});
                commit(MODULE_MUTATIONS.SET_MODULE_ENTITY, moduleEntity);
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    async SET_CURRENT_MODULE_FROM_SLUG({getters, dispatch}, slug) {
        let id = (<RootGetters> getters).getModuleIdFromSlug(slug);
        dispatch(MODULE_ACTIONS.SET_CURRENT_MODULE, id);
    }
};
