import {CreateModuleEntityPayload, SaveModuleEntityPayload} from '@shared/modules';
import {MODULE_MUTATIONS} from './module_mutations';
import {ModuleState} from './module_state';
import {Action, ActionTree} from 'vuex';
import {RootGetters, RootState} from '../../state_store';
import {Constant} from '@shared/typings/util_typings';
import {COURSE_MUTATIONS, CourseMode} from '@course/store/course_mutations';
import {loadModule, createModule, saveModule} from '@module/modules_requests';

export type ModuleAction<P> = Action<ModuleState, RootState>;

export type CreateModuleAction = ModuleAction<CreateModuleEntityPayload>;
export type SetCurrentModuleAction = ModuleAction<string>;
export type SetCurrentModuleFromSlugAction = ModuleAction<string>

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
        commit(MODULE_MUTATIONS.SET_MODULE_REQUEST_STAGE, {id: CREATE_ID, requesting: true});
        let {courseModuleDescriptions, moduleId, module} = await createModule(createModulePayload);
        commit(MODULE_MUTATIONS.SET_MODULE_REQUEST_STAGE, {id: CREATE_ID, requesting: false});
        commit(MODULE_MUTATIONS.SET_MODULE_ENTITY, module);
        commit(MODULE_MUTATIONS.SET_CURRENT_MODULE, moduleId);
        let {courseId} = createModulePayload;
        commit(COURSE_MUTATIONS.SET_COURSE_MODULE_DESCRIPTIONS, {courseId, courseModuleDescriptions});
    },
    async SET_CURRENT_MODULE({state, getters, dispatch, commit}, id) {
        try {
            if (id === state.currentModuleId) {
                // no change, state already matches
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
        commit(MODULE_MUTATIONS.SET_MODULE_ENTITY, await loadModule(id));
        commit(MODULE_MUTATIONS.SET_MODULE_REQUEST_STAGE, {id, requesting: false});
    },
    async SAVE_MODULE({commit, dispatch}, saveModuleEntity: SaveModuleEntityPayload){
        commit(MODULE_MUTATIONS.SET_MODULE_REQUEST_STAGE, {id: saveModuleEntity.id, requesting: true});
        let {courseModuleDescriptions, module} = await saveModule(saveModuleEntity);
        commit(MODULE_MUTATIONS.SET_MODULE_REQUEST_STAGE, {id: saveModuleEntity.id, requesting: false});

        let {courseId, id} = saveModuleEntity;
        commit(COURSE_MUTATIONS.SET_COURSE_MODULE_DESCRIPTIONS, {courseId, courseModuleDescriptions});
        commit(MODULE_MUTATIONS.SET_MODULE_ENTITY, module);

    }
};
