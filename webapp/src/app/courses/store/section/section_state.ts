import {RootGetters, RootState} from '../../../state_store';
import {ViewSectionQuillData, ViewSectionTransferData} from '../../../../../../shared/sections';

export interface SectionState {
    currentSectionTitle: string;
    currentSectionTransfer: ViewSectionTransferData;
    currentSectionId: string;
    sections: { [index: string]: ViewSectionQuillData }
    sectionRequests: { [index: string]: boolean }
}

export type SectionGetterFn = (state: SectionState, getters: RootGetters, rootState: RootState, rootGetters: RootGetters) => any;

export interface SectionGetters {
    currentSection: ViewSectionQuillData;
    currentSectionLoading: boolean;
    currentSectionLoaded: boolean;
    getSectionIdFromSlug: (slugs: { moduleId: string, sectionSlug: string }) => string;
    getSectionSlugFromId: (slugInfo: {moduleId: string, sectionId: string}) => string;
}

export const sectionGetters: {[index in keyof SectionGetters]: SectionGetterFn} = {
    currentSection: ({sections, currentSectionId}): ViewSectionQuillData => sections[currentSectionId],
    currentSectionLoaded: ({sections, currentSectionId}) => !!sections[currentSectionId],
    currentSectionLoading: ({currentSectionId, sectionRequests}) => !!currentSectionId && sectionRequests[currentSectionId],
    getSectionIdFromSlug(state, {courseNavigationDescription}) {
        if(!courseNavigationDescription) {
            return function(){};
        }
        return function (slugInfo: { moduleId: string, sectionSlug: string }): string {
            let module = courseNavigationDescription.modules.find(({id}) => id === slugInfo.moduleId);
            let section = module.sections.find(({slug}) => slug === slugInfo.sectionSlug);
            return section && section.id;
        }
    },
    getSectionSlugFromId: (state, {courseNavigationDescription}) => {
        if(!courseNavigationDescription){
            return function(){};
        }
        return function (slugInfo: {moduleId: string, sectionId: string}): string {
            let module = courseNavigationDescription.modules.find(({id}) => id === slugInfo.moduleId);
            let section = module.sections.find(({id}) => id === slugInfo.sectionId);
            return section && section.slug;
        }
    }
};

export const sectionState: SectionState = {
    currentSectionTitle: '',
    currentSectionTransfer: null,
    currentSectionId: '',
    sections: {},
    sectionRequests: {}
};
