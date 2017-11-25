import {ModuleEntity, ViewModuleTransferData} from '../../../../../../shared/modules';
import {RootState} from '../../../state_store';
import {RequestStage} from '../../../../../../shared/requests';

export interface ModuleState {
    currentModuleTitle: string;
    currentModuleTransfer: ViewModuleTransferData;
    currentModuleId: string;
    modules: { [index: string]: ModuleEntity }
    moduleRequests: {[index: string]: RequestStage}
}

export type ModuleGetterFn = (state: ModuleState, getters: ModuleGetters, rootState: RootState, rootGetters: any) => any;

export interface ModuleGetters {
    currentModule: ModuleEntity;
    currentModuleLoading: boolean;
}

export const moduleGetters: {[index:string]: ModuleGetterFn} = {
    currentModule: (state: ModuleState, getters: ModuleGetters, rootState: RootState, rootGetters: any): ModuleEntity => {
        // let courseGetters = rootState.course.getters;
        // let currentCourse = <CourseEntity> courseGetters.currentCourse;
        let currentCourse = {modules: []};

        if(!state.currentModuleId || !currentCourse) {
            return null;
        }

        return currentCourse.modules.find((el) => {
           return el.id === state.currentModuleId;
        });
    },
    currentModuleLoading: (state: ModuleState, getters: ModuleGetters, rootState: RootState, rootGetters: any): boolean => {
        return state.currentModuleId && state.moduleRequests[state.currentModuleId] === 'WAITING';
    }
};


export const moduleState: ModuleState = {
    // currentModule: {
    //     id: '',
    //     title: '',
    //     version: '',
    //     description: '',
    //     timeEstimate: '',
    //     lastModifiedAt: null,
    //     orderedContentIds: [],
    //     orderedQuestionIds: [],
    //     orderedContentQuestionIds: [],
    //     content: [],
    //     questions: [],
    //     orderedSectionIds: [],
    //     sections: [],
    //     fieldDeltas: {},
    // },
    currentModuleTitle: '',
    currentModuleTransfer: null,
    currentModuleId: '',
    modules: {},
    moduleRequests: {}
};
