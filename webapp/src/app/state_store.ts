import {StoreOptions} from 'vuex';
import {courseGetters, courseState} from '@course/store/course_state';
import {moduleGetters, moduleState} from '@module/store/module_state';
import {sectionGetters, sectionState} from '@section/store/section_state';
import {coursesMutations} from '@course/store/course_mutations';
import {courseActions} from '@course/store/course_actions';
import {moduleMutations} from '@module/store/module_mutations';
import {moduleActions} from '@module/store/module_actions';
import {
    coursesListingActions, coursesListingGetters, coursesListingMutations, coursesListingState
} from '@user/store/courses_listing_store';
import {userActions, userMutations, userState} from '@user/store/user_store';
import {sectionActions} from '@section/store/section_actions';
import {sectionMutations} from '@section/store/section_mutations';
import {
    availableCoursesActions, availableCoursesGetters, availableCoursesMutations,
    initAvailableCoursesState
} from "./available_courses/available_courses_store";
import {statusMessageModuleConfig} from "@global/status_messages/status_messages_store";
import {
    userProgressActions, userProgressGetters, userProgressMutations, userProgressState
} from "@user_progress/user_progress_store";
import {RootState} from "@webapp_root/store";


export const storeConfig: StoreOptions<RootState> = {
    // slows down production app and creating new vue stores triggers mutating outside of handlers warning when testing
    strict: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
    modules: {
        statusMessages: statusMessageModuleConfig.module(),
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

