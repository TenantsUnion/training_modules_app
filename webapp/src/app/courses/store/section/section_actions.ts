import {SECTION_MUTATIONS} from './section_mutations';
import {transformTransferViewService} from '../../../global/quill/transform_transfer_view_service';
import {COURSE_MUTATIONS} from '../course/course_mutations';
import {coursesService} from '../../courses_service';
import {RootGetters, RootState} from '../../../state_store';
import {SectionState} from './section_state';
import {Action, ActionTree} from 'vuex';
import {
    CreateSectionEntityPayload, SaveSectionEntityPayload, SaveSectionResponse,
    SectionEntity
} from '../../../../../../shared/sections';
import {Constant} from '../../../../../../shared/typings/util_typings';
import {MODULE_ACTIONS} from '../module/module_actions';

export type SectionAction<P> = Action<SectionState, RootState>;

export type CreateSectionAction = SectionAction<CreateSectionEntityPayload>;
export type SetCurrentSectionAction = SectionAction<{ sectionId: string, moduleId: string }>;
export type SetCurrentSectionFromSlugAction = SectionAction<{ slug: string, isAdmin: boolean }>

export interface SectionActions {
    CREATE_SECTION: CreateSectionAction,
    SET_CURRENT_SECTION: SetCurrentSectionAction;
    SET_CURRENT_SECTION_FROM_SLUG: SetCurrentSectionFromSlugAction;
    NEXT_SECTION: SectionAction<void>;
    PREVIOUS_SECTION: SectionAction<void>;
    SAVE_SECTION: SectionAction<SaveSectionEntityPayload>;
    LOAD_SECTION_ENTITY: SectionAction<{sectionId: string, moduleId: string}>
}

/**
 * Const for using course mutation type values
 */
export const SECTION_ACTIONS: Constant<SectionActions> = {
    CREATE_SECTION: 'CREATE_SECTION',
    SET_CURRENT_SECTION: 'SET_CURRENT_SECTION',
    SET_CURRENT_SECTION_FROM_SLUG: 'SET_CURRENT_SECTION_FROM_SLUG',
    NEXT_SECTION: 'NEXT_SECTION',
    PREVIOUS_SECTION: 'PREVIOUS_SECTION',
    SAVE_SECTION: 'SAVE_SECTION',
    LOAD_SECTION_ENTITY: 'LOAD_SECTION_ENTITY'
};

export const CREATE_ID = 'CREATING';
/**
 * Section store actions
 */
export const sectionActions: ActionTree<SectionState, RootState> & SectionActions = {
    CREATE_SECTION: async ({dispatch, commit, getters, rootState}, createSection: CreateSectionEntityPayload) => {
        commit(SECTION_MUTATIONS.SET_SECTION_REQUEST_STAGE, {id: CREATE_ID, requesting: true});
        let {course, sectionId} = await coursesService.createSection(createSection);
        commit(SECTION_MUTATIONS.SET_SECTION_REQUEST_STAGE, {id: CREATE_ID, requesting: false});
        commit(COURSE_MUTATIONS.SET_COURSE_ENTITY, course);

        await dispatch(MODULE_ACTIONS.LOAD_MODULE_ENTITY, rootState.module.currentModuleId);

        let section = getters.currentModule.sections.find((section) => section.id === sectionId);

        commit(SECTION_MUTATIONS.SET_SECTION_ENTITY, await transformTransferViewService.populateTrainingEntityQuillData(section));
        commit(SECTION_MUTATIONS.SET_CURRENT_SECTION, sectionId);
    },
    async SET_CURRENT_SECTION({state, getters, commit}, {sectionId, moduleId}) {
        try {
            if (sectionId === state.currentSectionId) {
                // provided id matches id of current section, no changes to state needed
                return;
            }

            commit(SECTION_MUTATIONS.SET_CURRENT_SECTION, sectionId);
            if (!getters.currentSectionLoaded) {
                commit(SECTION_MUTATIONS.SET_SECTION_REQUEST_STAGE, {sectionId, requesting: true});
                let sectionTransferData = getters.getSectionTransferData(moduleId, sectionId);
                let sectionEntity = await transformTransferViewService.populateTrainingEntityQuillData(sectionTransferData);
                commit(SECTION_MUTATIONS.SET_SECTION_REQUEST_STAGE, {sectionId, requesting: false});
                commit(SECTION_MUTATIONS.SET_SECTION_ENTITY, sectionEntity);
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    async SET_CURRENT_SECTION_FROM_SLUG({getters, dispatch}, slug: { moduleId: string, sectionSlug: string }) {
        let sectionId = (<RootGetters> getters).getSectionIdFromSlug(slug);
        dispatch(SECTION_ACTIONS.SET_CURRENT_SECTION, {
            moduleId: slug.moduleId,
            sectionId
        });
    },
    async NEXT_SECTION({getters, dispatch, rootState}) {
        let nextId = getters.nextSectionIdInModule;
        if (!nextId) {
            return;
        }

        await dispatch(SECTION_ACTIONS.SET_CURRENT_SECTION, {
            sectionId: nextId,
            moduleId: rootState.module.currentModuleId
        });
    },
    async PREVIOUS_SECTION({getters, dispatch, rootState}) {
        let previousId = getters.previousSectionIdInModule;
        if (!previousId) {
            return;
        }

        await dispatch(SECTION_ACTIONS.SET_CURRENT_SECTION, {
            sectionId: previousId,
            moduleId: rootState.module.currentModuleId
        });
    },
    async SAVE_SECTION({commit, getters, dispatch, rootState}, saveSectionEntity: SaveSectionEntityPayload) {
        commit(SECTION_MUTATIONS.SET_SECTION_REQUEST_STAGE, {id: saveSectionEntity.id, requesting: true});
        let response: SaveSectionResponse = await coursesService.saveSection(saveSectionEntity);
        commit(SECTION_MUTATIONS.SET_SECTION_REQUEST_STAGE, {id: saveSectionEntity.id, requesting: false});
        commit(COURSE_MUTATIONS.SET_COURSE_ENTITY, response.course);
        await dispatch(SECTION_ACTIONS.LOAD_SECTION_ENTITY, response);
    },
    async LOAD_SECTION_ENTITY({commit, getters}, ids: {sectionId: string, moduleId: string}) {
       let sectionTransferData = getters.getSectionTransferData(ids.moduleId, ids.sectionId);
        commit(SECTION_MUTATIONS.SET_SECTION_REQUEST_STAGE, {id: ids.sectionId, requesting: true});
        let moduleEntity = await transformTransferViewService.populateTrainingEntityQuillData(sectionTransferData);
        commit(SECTION_MUTATIONS.SET_SECTION_REQUEST_STAGE, {id: ids.sectionId, requesting: false});
        commit(SECTION_MUTATIONS.SET_SECTION_ENTITY, moduleEntity);
    }
};
