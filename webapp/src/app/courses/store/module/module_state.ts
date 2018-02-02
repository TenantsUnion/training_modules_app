import {RootGetters, RootState} from '../../../state_store';
import {ViewModuleData} from '@shared/modules';

export interface ModuleState {
    currentModuleTitle: string;
    currentModuleId: string;
    modules: { [index: string]: ViewModuleData }
    moduleRequests: { [index: string]: boolean }
}

export type ModuleGetterFn = (state: ModuleState, getters: RootGetters, rootState: RootState, rootGetters: RootGetters) => any;

export interface ModuleGetters {
    currentModule: ViewModuleData;
    currentModuleLoading: boolean;
    currentModuleLoaded: boolean;
    getModuleIdFromSlug: (string) => string;
    getModuleSlugFromId: (string) => string;
    currentModuleSlug: string;
}

export type getModuleSlugFromIdFn = (id:string) => string;

export const moduleGetters: { [index in keyof ModuleGetters]: ModuleGetterFn } = {
    currentModule: ({modules, currentModuleId}): ViewModuleData => modules[currentModuleId],
    currentModuleLoaded: ({modules, currentModuleId}) => !!modules[currentModuleId],
    currentModuleLoading: ({currentModuleId, moduleRequests}) => !!(currentModuleId && moduleRequests[currentModuleId]),
    getModuleIdFromSlug(state: ModuleState, {courseNavigationDescription}): (string) => string {
        if (!courseNavigationDescription) {
            return function (string) {
                // noop
                return null;
            };
        }
        let moduleSlugIdMap = courseNavigationDescription.modules.reduce((acc, {slug, id}) => {
            acc[slug] = id;
            return acc;
        }, {});
        return function (id) {
            return moduleSlugIdMap[id];
        }
    },
    getModuleSlugFromId(state, {courseNavigationDescription}): getModuleSlugFromIdFn {
        if (!courseNavigationDescription) {
            return function (x: string) {
                // noop
                return null;
            };
        }
        let moduleIdSlugMap = courseNavigationDescription.modules.reduce((acc, {slug, id}) => {
            acc[id] = slug;
            return acc;
        }, {});
        return function (id) {
            return moduleIdSlugMap[id];
        }
    },
    currentModuleSlug: ({currentModuleId}, {getModuleSlugFromId}) => getModuleSlugFromId(currentModuleId)
};

export const moduleState: ModuleState = {
    currentModuleTitle: '',
    currentModuleId: '',
    modules: {},
    moduleRequests: {}
};
