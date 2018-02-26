import Vuex, {Action, ActionContext, Store} from 'vuex';
import Vue from 'vue';
import {CourseGetters, courseGetters, CourseState, courseState} from '@course/store/course_state';
import {ModuleGetters, moduleGetters, ModuleState, moduleState} from '@module/store/module_state';
import {sectionGetters, SectionGetters, sectionState, SectionState} from '@section/store/section_state';
import {coursesMutations} from '@course/store/course_mutations';
import {courseActions} from '@course/store/course_actions';
import {moduleMutations} from '@module/store/module_mutations';
import {moduleActions} from '@module/store/module_actions';
import {
    userCoursesListingActions, userCoursesListingGetters, UserCoursesListingGetters,
    userCoursesListingMutations, UserCoursesListingState,
    userCoursesListingState
} from './user/store/courses_listing_store';
import {userActions, userMutations, userState, UserState} from './user/store/user_store';
import {sectionActions} from '@section/store/section_actions';
import {sectionMutations} from '@section/store/section_mutations';
import {
    availableCoursesActions, AvailableCoursesGetters, availableCoursesGetters, availableCoursesMutations,
    AvailableCoursesState,
    initAvailableCoursesState
} from "./available_courses/available_courses_store";
import {
    statusMessageActions, statusMessagesMutations, StatusMessagesState,
    statusMessagesState
} from "@global/status_messages/status_messages_store";

Vue.use(Vuex);

/**
 * Type for vuex action that generically types the payload (default definition has payload typed to 'any')
 */
export type TypedAction<S, P, V> = (context: ActionContext<S, RootState>, payload: P) => (Promise<V> | V) | Action<S, RootState>;
/**
 * Stronger typing than vuex ActionTree that only enforces string keys and Action properties.
 * This goes one step further by being able to enforce an interface I with each property an action with a typed payload
 */
export const store: Store<RootState> = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules: {
        statusMessages: {
            state: statusMessagesState,
            actions: statusMessageActions,
            mutations: statusMessagesMutations
        },
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
        },
        section: {
            state: sectionState,
            actions: sectionActions,
            mutations: sectionMutations,
            getters: sectionGetters
        },
        availableCourses: {
            state: initAvailableCoursesState,
            actions: availableCoursesActions,
            mutations: availableCoursesMutations,
            getters: availableCoursesGetters
        }
    }
});

export interface RootState {
    user: UserState,
    course: CourseState
    module: ModuleState,
    section: SectionState,
    userCourses: UserCoursesListingState,
    availableCourses: AvailableCoursesState
    statusMessages: StatusMessagesState
}

export type RootGetters =
    CourseGetters
    & UserCoursesListingGetters
    & ModuleGetters
    & SectionGetters
    & AvailableCoursesGetters;

// getters and rootGetters are the same since the modules have the namespace option set to false
export type AppGetter<S> = ((state: S, getters: RootGetters, rootState: RootState, rootGetters: RootGetters) => any);
