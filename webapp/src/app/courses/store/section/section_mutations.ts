import {MutationTree} from 'vuex';
import {SectionState} from './section_state';

export type SectionMutationTree = MutationTree<SectionState>;

export interface SectionMutations {

};

export const sectionMutations: SectionMutations & MutationTree<SectionState> = {};

