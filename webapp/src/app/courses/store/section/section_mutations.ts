import Vue from 'vue';
import {Mutation, MutationTree} from 'vuex';
import {SectionState} from './section_state';
import {SectionEntity} from '../../../../../../shared/sections';
import {Constant} from '../../../../../../shared/typings/util_typings';

export type SectionMutation<P> = (state: SectionState, payload: P) => any & Mutation<SectionState>;

export interface SectionMutations {
    SET_CURRENT_SECTION: SectionMutation<String>;
    SET_SECTION_REQUEST_STAGE: SectionMutation<{ id: string; requesting: boolean }>
    SET_SECTION_ENTITY: SectionMutation<SectionEntity>;
}

/**
 * Const for using section mutation type values
 */
export const SECTION_MUTATIONS: Constant<SectionMutations> = {
    SET_CURRENT_SECTION: 'SET_CURRENT_SECTION',
    SET_SECTION_REQUEST_STAGE: 'SET_SECTION_REQUEST_STAGE',
    SET_SECTION_ENTITY: 'SET_SECTION_ENTITY'
};

/**
 * Store mutations
 */
export const sectionMutations: SectionMutations & MutationTree<SectionState> = {
    SET_CURRENT_SECTION: (state: SectionState, sectionId: string) => {
        state.currentSectionId = sectionId;
    },
    SET_SECTION_REQUEST_STAGE: (state: SectionState, {id, requesting}) => {
        Vue.set(state.sectionRequests, id, requesting);

    },
    SET_SECTION_ENTITY: (state: SectionState, section: SectionEntity) => {
        Vue.set(state.sections, section.id, section);
    }
};
