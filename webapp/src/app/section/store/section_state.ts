import {RootGetters, RootState} from '../../state_store';
import {ViewSectionData} from '../../../../../shared/sections';

export interface SectionState {
    currentSectionTitle: string;
    currentSectionId: string;
    sections: { [index: string]: ViewSectionData }
    sectionRequests: { [index: string]: boolean }
}

export type SectionGetterFn = (state: SectionState, getters: RootGetters, rootState: RootState, rootGetters: RootGetters) => any;

export interface SectionGetters {
    currentSection: ViewSectionData;
    currentSectionLoading: boolean;
    currentSectionLoaded: boolean;
    getSectionIdFromSlug: (slugInfo: { moduleId: string, sectionSlug: string }) => string;
    getSectionSlugFromId: (idInfo: { moduleId: string, sectionId: string }) => string;
}

export type getSectionSlugFromIdFn = (slugInfo: { moduleId: string, sectionId: string }) => string;
export type getSectionIdFromSlugFn = (slugInfo: { moduleId: string, sectionSlug: string }) => string;
export const sectionGetters: {[index in keyof SectionGetters]: SectionGetterFn} = {
    currentSection: ({sections, currentSectionId}): ViewSectionData => sections[currentSectionId],
    currentSectionLoaded: ({sections, currentSectionId}) => !!sections[currentSectionId],
    currentSectionLoading: ({currentSectionId, sectionRequests}) => !!currentSectionId && sectionRequests[currentSectionId],
    getSectionIdFromSlug(state, {courseNavigationDescription}): getSectionIdFromSlugFn {
        if (!courseNavigationDescription) {
            return function () {
                throw new Error('Cannot determine section id when courseNavigationDescription is null');
            };
        }
        return function ({moduleId, sectionSlug}: { moduleId: string, sectionSlug: string }): string {
            let module = courseNavigationDescription.modules.find(({id}) => id === moduleId);
            let section = module.sections.find(({slug}) => slug === sectionSlug);
            return section && section.id;
        }
    },
    getSectionSlugFromId(state, {courseNavigationDescription}): getSectionSlugFromIdFn {
        if (!courseNavigationDescription) {
            return function () {
                throw new Error('Cannot determine section slug when courseNavigationDescription is null');
            }
        }
        return function ({moduleId, sectionId}: { moduleId: string, sectionId: string }): string {
            let module = courseNavigationDescription.modules.find(({id}) => id === moduleId);
            let section = module.sections.find(({id}) => id === sectionId);
            return section && section.slug;
        }
    }
};

export const sectionState: SectionState = {
    currentSectionTitle: '',
    currentSectionId: '',
    sections: {},
    sectionRequests: {}
};
