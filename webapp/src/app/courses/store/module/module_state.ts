import {ModuleEntity, ViewModuleQuillData, ViewModuleTransferData} from '../../../../../../shared/modules';
import {RootGetters, RootState} from '../../../state_store';
import {titleToSlug} from '../../../../../../shared/slug/title_slug_transformations';
import Vue from 'vue';
import * as _ from 'underscore';
import {CourseEntity} from '../../../../../../shared/courses';

export interface ModuleState {
    currentModuleTitle: string;
    currentModuleTransfer: ViewModuleTransferData;
    currentModuleId: string;
    modules: { [index: string]: ViewModuleQuillData }
    moduleRequests: { [index: string]: boolean }
}

export type ModuleGetterFn = (state: ModuleState, getters: RootGetters, rootState: RootState, rootGetters: RootGetters) => any;

export interface ModuleGetters {
    currentModule: ViewModuleQuillData;
    currentModuleLoading: boolean;
    currentModuleLoaded: boolean;
    moduleSlugIdMap: { [index: string]: string };
    getModuleIdFromSlug: (string) => string;
    moduleNavigationDescriptions: { id: string, title: string, slug: string }[];
}

export const moduleGetters: { [index: string]: ModuleGetterFn } = {
    currentModule: ({modules, currentModuleId}): ViewModuleQuillData => modules[currentModuleId],
    currentModuleLoaded(state) {
        !!state.modules[state.currentModuleId];
    },
    currentModuleLoading: (state: ModuleState, getters: ModuleGetters, rootState: RootState, rootGetters: RootGetters): boolean => {
        return state.currentModuleId && state.moduleRequests[state.currentModuleId];
    },
    moduleNavigationDescriptions(state, getters, rootState, rootGetters) {
        if (!getters.currentCourse || !_.isArray(getters.currentCourse.modules)) {
            return [];
        }
        let uniqueTitle = getters.currentCourse.modules.reduce((acc, {title}) => {
            acc[title] = _.isUndefined(acc[title]);
            return acc;
        }, {});
        return getters.currentCourse.modules.map(({id, title}) => {
            return {
                id, title,
                slug: titleToSlug(title, !uniqueTitle[title], id)
            }
        });
    },
    getModuleIdFromSlug(state: ModuleState, getters, rootState: RootState, rootGetters: RootGetters) {
        let moduleSlugIdMap = getters.moduleNavigationDescriptions.reduce((acc, {slug, id}) => {
            acc[slug] = id;
            return acc;
        }, {});
        return function (slug) {
            return moduleSlugIdMap[slug];
        }
    }
};


export const moduleState: ModuleState = {
    currentModuleTitle: '',
    currentModuleTransfer: null,
    currentModuleId: '',
    modules: {},
    moduleRequests: {}
};
