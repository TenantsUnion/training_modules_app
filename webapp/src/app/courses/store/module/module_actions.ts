import {
    CreateModuleEntityPayload, ModuleEntity, SaveModuleEntityPayload, SaveModuleResponse
} from '@shared/modules';
import {MODULE_MUTATIONS} from './module_mutations';
import {ModuleState} from './module_state';
import {Action, ActionTree} from 'vuex';
import {RootGetters, RootState} from '../../../state_store';
import {Constant} from '@shared/typings/util_typings';
import {coursesService} from '../../courses_service';
import {COURSE_MUTATIONS} from '../course/course_mutations';
import {loadModule, createModule} from '../../modules/modules_requests';

export type ModuleAction<P> = Action<ModuleState, RootState>;

export type CreateModuleAction = ModuleAction<CreateModuleEntityPayload>;
export type SetCurrentModuleAction = ModuleAction<ModuleEntity>;
export type SetCurrentModuleFromSlugAction = ModuleAction<{ slug: string, isAdmin: boolean }>

export interface ModuleActions {
    CREATE_MODULE: CreateModuleAction,
    SET_CURRENT_MODULE: SetCurrentModuleAction;
    SET_CURRENT_MODULE_FROM_SLUG: SetCurrentModuleFromSlugAction;
    LOAD_MODULE_ENTITY: ModuleAction<string>; //module id
    SAVE_MODULE: ModuleAction<SaveModuleEntityPayload>;
}

/**
 * Const for using course mutation type values
 */
export const MODULE_ACTIONS: Constant<ModuleActions> = {
    CREATE_MODULE: 'CREATE_MODULE',
    SET_CURRENT_MODULE: 'SET_CURRENT_MODULE',
    SET_CURRENT_MODULE_FROM_SLUG: 'SET_CURRENT_MODULE_FROM_SLUG',
    LOAD_MODULE_ENTITY: 'LOAD_MODULE_ENTITY',
    SAVE_MODULE: 'SAVE_MODULE'
};

export const CREATE_ID = 'CREATING';
/**
 * Module store actions
 */
export const moduleActions: ActionTree<ModuleState, RootState> & ModuleActions = {
    CREATE_MODULE: async ({commit, getters}, createModulePayload: CreateModuleEntityPayload) => {
        // todo return created module as well
        commit(MODULE_MUTATIONS.SET_MODULE_REQUEST_STAGE, {id: CREATE_ID, requesting: true});
        let {course, moduleId, module} = await createModule(createModulePayload);
        commit(MODULE_MUTATIONS.SET_MODULE_REQUEST_STAGE, {id: CREATE_ID, requesting: false});
        commit(MODULE_MUTATIONS.SET_MODULE_ENTITY, module);
        commit(MODULE_MUTATIONS.SET_CURRENT_MODULE, moduleId);
        // todo return course entity delta to update module descriptions
        commit(COURSE_MUTATIONS.SET_COURSE_ENTITY, course);
    },
    async SET_CURRENT_MODULE({state, getters, dispatch, commit}, id) {
        try {
            if (id === state.currentModuleId) {
                // provided id matches id of current module, no changes to state needed
                return;
            }

            commit(MODULE_MUTATIONS.SET_CURRENT_MODULE, id);
            if (!getters.currentModuleLoaded) {
                dispatch(MODULE_ACTIONS.LOAD_MODULE_ENTITY, id);
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    async SET_CURRENT_MODULE_FROM_SLUG({getters, dispatch}, slug) {
        let id = (<RootGetters> getters).getModuleIdFromSlug(slug);
        dispatch(MODULE_ACTIONS.SET_CURRENT_MODULE, id);
    },
    async LOAD_MODULE_ENTITY({commit, getters}, id: string) {
        commit(MODULE_MUTATIONS.SET_MODULE_REQUEST_STAGE, {id, requesting: true});
        commit(MODULE_MUTATIONS.SET_MODULE_ENTITY, await loadModule(getters.currentCourseId, id));
        commit(MODULE_MUTATIONS.SET_MODULE_REQUEST_STAGE, {id, requesting: false});
    },
    async SAVE_MODULE({commit, dispatch}, saveModuleEntity: SaveModuleEntityPayload){
        commit(MODULE_MUTATIONS.SET_MODULE_REQUEST_STAGE, {id: saveModuleEntity.id, requesting: true});
        let response: SaveModuleResponse = await coursesService.saveModule(saveModuleEntity);
        commit(MODULE_MUTATIONS.SET_MODULE_REQUEST_STAGE, {id: saveModuleEntity.id, requesting: false});

        // todo return course entity to update modules property
        commit(COURSE_MUTATIONS.SET_COURSE_ENTITY, response.course);
        await dispatch(MODULE_ACTIONS.LOAD_MODULE_ENTITY, response.moduleId);

    }
};
