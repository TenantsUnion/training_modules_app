import {StoreOptions} from 'vuex';
import {courseStoreConfig} from '@course/store/course_state';
import {moduleStoreConfig} from '@module/store/module_state';
import {sectionStoreConfig} from '@section/store/section_state';
import {coursesListingStoreConfig} from '@user/store/courses_listing_store';
import {availableCoursesStoreConfig} from "./available_courses/available_courses_store";
import {statusMessageStoreConfig} from "@global/status_messages/status_messages_store";
import {RootState} from "@webapp_root/store";
import {userStoreConfig} from "@user/store/user_store";
import {userProgressStoreConfig} from "@user_progress/user_progress_store";
import {trainingStoreConfig} from "@training/training_store";


export const storeConfig: StoreOptions<RootState> = {
    // slows down production app and creating new vue stores triggers mutating outside of handlers warning when testing
    strict: process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test',
    modules: {
        statusMessages: statusMessageStoreConfig.module(),
        user: userStoreConfig.module(),
        coursesListing: coursesListingStoreConfig.module(),
        userProgress: userProgressStoreConfig.module(),
        course: courseStoreConfig.module(),
        module: moduleStoreConfig.module(),
        section: sectionStoreConfig.module(),
        availableCourses: availableCoursesStoreConfig.module(),
        training: trainingStoreConfig.module()
    }
};

