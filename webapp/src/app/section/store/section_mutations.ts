import Vue from 'vue';
import {Mutation} from 'vuex';
import {SectionState} from './section_state';

export type SectionMutation<P> = (state: SectionState, payload: P) => any & Mutation<SectionState>;

export type SectionMutations = {[index in SECTION_MUTATIONS]: SectionMutation<any>} & {
    SET_CURRENT_SECTION: SectionMutation<String>;
    SET_SECTION_REQUEST_STAGE: SectionMutation<{ id: string; requesting: boolean }>
}

/**
 * Const for using section mutation type values
 */
export enum SECTION_MUTATIONS {
    SET_CURRENT_SECTION = 'SET_CURRENT_SECTION',
    SET_SECTION_REQUEST_STAGE = 'SET_SECTION_REQUEST_STAGE'
}

/**
 * Store mutations
 */
export const sectionMutations: SectionMutations = {
    SET_CURRENT_SECTION: (state: SectionState, sectionId: string) => {
        state.currentSectionId = sectionId;
    },
    SET_SECTION_REQUEST_STAGE: (state: SectionState, {id, requesting}) => {
        Vue.set(state.sectionRequests, id, requesting);
    }
};
