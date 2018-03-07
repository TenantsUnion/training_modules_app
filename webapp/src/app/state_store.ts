import {Action, ActionContext} from 'vuex';
import {CourseGetters, courseGetters, CourseState, courseState} from '@course/store/course_state';
import {ModuleGetters, moduleGetters, ModuleState, moduleState} from '@module/store/module_state';
import {sectionGetters, SectionGetters, sectionState, SectionState} from '@section/store/section_state';
import {coursesMutations} from '@course/store/course_mutations';
import {courseActions} from '@course/store/course_actions';
import {moduleMutations} from '@module/store/module_mutations';
import {moduleActions} from '@module/store/module_actions';
import {
    coursesListingActions, CoursesListingGetters, coursesListingGetters, coursesListingMutations, CoursesListingState,
    coursesListingState
} from '@user/store/courses_listing_store';
import {userActions, userMutations, userState, UserState} from '@user/store/user_store';
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
import {
    userProgressActions, userProgressGetters, UserProgressGetters, userProgressMutations, UserProgressState,
    userProgressState
} from "@user_progress/user_progress_store";

/**
 * Type for vuex action that generically types the payload (default definition has payload typed to 'any')
 * Stronger typing than vuex ActionTree that only enforces string keys and Action properties.
 * This goes one step further by being able to enforce an interface I with each property an action with a typed payload
 */
export type TypedAction<S, P, V> = (context: ActionContext<S, RootState>, payload: P) => (Promise<V> | V) | Action<S, RootState>;


export const storeConfig = {
    // slows down production app and creating new vue stores triggers mutating outside of handlers warning when testing
    strict: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
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
            state: coursesListingState,
            getters: coursesListingGetters,
            actions: coursesListingActions,
            mutations: coursesListingMutations
        },
        userProgress: {
            state: userProgressState,
            getters: userProgressGetters,
            actions: userProgressActions,
            mutations: userProgressMutations
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
};

export interface RootState {
    user: UserState,
    course: CourseState
    module: ModuleState,
    section: SectionState,
    userCourses: CoursesListingState,
    userProgress: UserProgressState,
    availableCourses: AvailableCoursesState
    statusMessages: StatusMessagesState
}

export type RootGetters = CourseGetters & CoursesListingGetters & ModuleGetters
    & SectionGetters & AvailableCoursesGetters & UserProgressGetters;

// getters and rootGetters are the same since the modules have the namespace option set to false
export type AppGetter<S> = ((state: S, getters: RootGetters, rootState: RootState, rootGetters: RootGetters) => any);
