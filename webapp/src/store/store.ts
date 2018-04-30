import Vue from "vue";
import Vuex from "vuex";
import {courseStoreConfig} from "@course/course_store";
import {editCourseCommandStoreConfig} from "@course/edit_course_command_store";
import {statusMessageStoreConfig} from "@global/status_messages/status_messages_store";
import {trainingStoreConfig} from "@training/training_store";
import {availableCoursesStoreConfig} from "@webapp/available_courses/available_courses_store";
import {RootGetters, RootState} from "@store/store_types";
import {coursesListingStoreConfig} from "@webapp/user/store/courses_listing_store";
import {userStoreConfig} from "@webapp/user/store/user_store";
import {userProgressStoreConfig} from "@webapp/user_progress/user_progress_store";
import {StoreOptions, Store} from "vuex";
import {courseProgressSummaryConfig} from '@course/course_enrolled/course_enrolled_summary/course_enrolled_summary_store';
import {editTrainingStoreConfig} from '@training/edit_training_store/edit_training_state';


export const storeConfig: StoreOptions<RootState> = {
    // slows down production app and creating new vue stores triggers mutating outside of handlers warning when testing
    strict: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
    modules: {
        statusMessages: statusMessageStoreConfig.module(),
        user: userStoreConfig.module(),
        coursesListing: coursesListingStoreConfig.module(),
        userProgress: userProgressStoreConfig.module(),
        course: courseStoreConfig.module(),
        availableCourses: availableCoursesStoreConfig.module(),
        editTraining: editTrainingStoreConfig.module(),
        training: trainingStoreConfig.module(),
        editCourseCommand: editCourseCommandStoreConfig.module(),
        courseProgressSummary: courseProgressSummaryConfig.module()
    }
};

Vue.use(Vuex);
export const store = new Store(storeConfig);
export const appGetters: RootGetters = store.getters;
export const appState: RootState = store.getters;

