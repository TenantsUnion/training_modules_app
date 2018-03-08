import {RootGetters, RootState, VuexModule, VuexModuleConfig} from '@webapp_root/store';
import {ViewModuleData} from '@shared/modules';
import {moduleActions, ModuleActions} from "@module/store/module_actions";
import {moduleMutations, ModuleMutations} from "@module/store/module_mutations";

export interface ModuleState {
    currentModuleTitle: string;
    currentModuleId: string;
    modules: { [index: string]: ViewModuleData }
    moduleRequests: { [index: string]: boolean }
}

export type ModuleGetterFn = (state: ModuleState, getters: RootGetters, rootState: RootState, rootGetters: RootGetters) => any;

export interface ModuleAccessors {
    currentModule: ViewModuleData;
    currentModuleLoading: boolean;
    currentModuleLoaded: boolean;
    getModuleIdFromSlug: (string) => string;
    getModuleSlugFromId: (string) => string;
    currentModuleSlug: string;
}

export type getModuleSlugFromIdFn = (id: string) => string;

type ModuleGetters = { [index in keyof ModuleAccessors]: ModuleGetterFn };
export const moduleGetters: ModuleGetters = {
    currentModule: ({modules, currentModuleId}): ViewModuleData => modules[currentModuleId],
    currentModuleLoaded: ({modules, currentModuleId}) => !!modules[currentModuleId],
    currentModuleLoading: ({currentModuleId, moduleRequests}) => !!(currentModuleId && moduleRequests[currentModuleId]),
    getModuleIdFromSlug (state: ModuleState, {courseNavigationDescription}): (string) => string {
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
    getModuleSlugFromId (state, {courseNavigationDescription}): getModuleSlugFromIdFn {
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

export type ModuleStoreConfig = VuexModuleConfig<ModuleState, ModuleGetters, ModuleActions, ModuleMutations>
export const moduleStoreConfig: ModuleStoreConfig = {
    initState (): ModuleState {
        return {
            currentModuleTitle: '',
            currentModuleId: '',
            modules: {},
            moduleRequests: {}
        };
    },
    module (): VuexModule<ModuleState, ModuleActions, ModuleGetters, ModuleMutations> {
        return {
            actions: moduleActions,
            getters: moduleGetters,
            state: this.initState(),
            mutations: moduleMutations
        };
    }
};
