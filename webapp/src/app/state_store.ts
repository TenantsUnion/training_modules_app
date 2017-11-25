import Vuex, {Store} from 'vuex';
import Vue from 'vue';
import {courseGetters, CourseState, courseState} from './courses/store/course/course_state';
import {moduleGetters, ModuleState, moduleState} from './courses/store/module/module_state';
import {SectionState} from './courses/store/section/section_state';
import {CourseEntity} from '../../../shared/courses';
import {CourseMutationTree, coursesMutations} from './courses/store/course/course_mutations';
import {courseActions, CourseActionTree} from './courses/store/course/course_actions';
import {ModuleEntity} from '../../../shared/modules';
import {moduleMutations, ModuleMutationTree} from './courses/store/module/module_mutations';
import {moduleActions, ModuleActionTree} from './courses/store/module/module_actions';
import {SectionEntity} from '../../../shared/sections';
import {SectionMutationTree} from './courses/store/section/section_mutations';
import {appRouter} from './router';

Vue.use(Vuex);

export const appStore: Store<any> = new Vuex.Store({
    modules: {
        course: {
            state: courseState,
            actions: courseActions,
            mutations: coursesMutations,
            getters: courseGetters
        },
        module: {
            state: moduleState,
            actions: moduleActions,
            mutations: moduleMutations,
            getters: moduleGetters
        }
    }
});

export interface RootState {
    state: {
        course: {
            getters: {
                currentCourse: CourseEntity,
                currentCourseLoading: boolean
            },
            state: CourseState,
            dispatch: CourseMutationTree,
            actions: CourseActionTree
        },
        module: {
            getters: {
                currentModule: ModuleEntity,
                currentModuleLoading: boolean
            },
            state: ModuleState,
            dispatch: ModuleMutationTree,
            actions: ModuleActionTree
        },
        section: {
            getters: {
                currentSection: SectionEntity,
                currentSectionLoading: boolean
            },
            state: SectionState,
            dispatch: SectionMutationTree,
            actions: ModuleActionTree
        }
        [index: string]: any
    }
}

