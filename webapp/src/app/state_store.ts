import Vuex, {Getter, Store} from 'vuex';
import Vue from 'vue';
import {CourseGetters, courseGetters, CourseState, courseState} from './courses/store/course/course_state';
import {ModuleGetters, moduleGetters, ModuleState, moduleState} from './courses/store/module/module_state';
import {SectionState} from './courses/store/section/section_state';
import {coursesMutations} from './courses/store/course/course_mutations';
import {courseActions} from './courses/store/course/course_actions';
import {moduleMutations} from './courses/store/module/module_mutations';
import {moduleActions} from './courses/store/module/module_actions';
import {
    userCoursesListingActions, userCoursesListingGetters, UserCoursesListingGetters,
    userCoursesListingMutations, UserCoursesListingState,
    userCoursesListingState
} from './courses/store/courses_listing/courses_listing_store';
import {userActions, userMutations, userState, UserState} from './courses/store/user/user_store';

Vue.use(Vuex);

export const store: Store<any> = new Vuex.Store({
    modules: {
        user: {
            state: userState,
            actions: userActions,
            mutations: userMutations
        },
        userCourses: {
            state: userCoursesListingState,
            getters: userCoursesListingGetters,
            actions: userCoursesListingActions,
            mutations: userCoursesListingMutations
        },
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
    user: UserState,
    course: CourseState
    module: ModuleState,
    section: SectionState,
    userCourses: UserCoursesListingState
}

export type RootGetters = CourseGetters & UserCoursesListingGetters & ModuleGetters;

// getters and rootGetters are the same since the modules have the namespace option set to false
export type AppGetter<S> = Getter<S, RootState>
    & ((state: S, getters: RootGetters, rootState: RootState, rootGetters: RootGetters) => any);
