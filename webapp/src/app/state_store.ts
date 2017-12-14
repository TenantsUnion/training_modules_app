import Vuex, {Dispatch, Store} from 'vuex';
import Vue from 'vue';
import {courseGetters, CourseState, courseState} from './courses/store/course/course_state';
import {moduleGetters, ModuleState, moduleState} from './courses/store/module/module_state';
import {SectionState} from './courses/store/section/section_state';
import {CourseEntity} from '../../../shared/courses';
import {coursesMutations} from './courses/store/course/course_mutations';
import {courseActions} from './courses/store/course/course_actions';
import {ModuleEntity} from '../../../shared/modules';
import {moduleMutations} from './courses/store/module/module_mutations';
import {moduleActions} from './courses/store/module/module_actions';
import {SectionEntity} from '../../../shared/sections';
import {SectionMutationTree} from './courses/store/section/section_mutations';
import {appRouter} from './router';
import {
    userCoursesListingActions,
    userCoursesListingMutations,
    userCoursesListingState
} from './courses/store/courses_listing/courses_listing_store';

Vue.use(Vuex);

export const store: Store<any> = new Vuex.Store({
    modules: {
        userCourses: {
            namespaced: true,
            state: userCoursesListingState,
            actions: userCoursesListingActions,
            mutations: userCoursesListingMutations
        },
        course: {
            namespaced: true,
            state: courseState,
            actions: courseActions,
            mutations: coursesMutations,
            getters: courseGetters
        },
        module: {
            namespaced: true,
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
            dispatch: Dispatch,
        },
        module: {
            getters: {
                currentModule: ModuleEntity,
                currentModuleLoading: boolean
            },
            state: ModuleState,
            dispatch: Dispatch,
        },
        section: {
            getters: {
                currentSection: SectionEntity,
                currentSectionLoading: boolean
            },
            state: SectionState,
            dispatch: SectionMutationTree,
        }
        [index: string]: any
    }
}

