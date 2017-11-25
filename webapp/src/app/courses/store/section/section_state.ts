import {RootState} from '../../../state_store';
import {Getter, GetterTree} from 'vuex';
import {SectionEntity} from '../../../../../../shared/sections';


/**
 * Top level property keys refer to course ids with property object of corresponding module ids and each module id value
 * is an object of section ids with the actual {@link SectionEntity} as its value.
 *
 * The way to look up a section is SectionsMap[courseId][moduleId][sectionId];
 */
export type SectionsMap = {[index:string]: {[index:string]: {[index: string]: SectionEntity}}};

export interface SectionState  {
    currentSectionId: string;
    currentSectionTitle: string;
    sections: SectionsMap;
}

export const sectionGetters: GetterTree<SectionState, RootState> = {
    currentSection: (state, rootState) => {
        // check if waiting on course --
        let currentModule = rootState.module.getters.currentModule;
    },
    currentSectionLoading: (state, rootState) => {
    }
};
