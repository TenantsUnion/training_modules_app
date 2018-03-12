import {store} from "@webapp_root/app";
import {TRAINING_ACTIONS} from "@training/training_store";
import {NavigationGuard} from "vue-router";

const courseTrainingGuard: NavigationGuard = async (to: any, from: any, next) => {
    const {currentCourseId} = store.state.course;
    try {
        await store.dispatch(TRAINING_ACTIONS.SET_CURRENT_COURSE_TRAINING, currentCourseId);
    } catch (e) {
        console.error(`Error setting course ${currentCourseId} as current training.\nException: ${e}`);
    } finally {
        next();
    }
};

const moduleTrainingGuard: NavigationGuard = async (to: any, from: any, next) => {
    const {currentModuleId} = store.state.module;
    try {
        await store.dispatch(TRAINING_ACTIONS.SET_CURRENT_MODULE_TRAINING, currentModuleId);
    } catch (e) {
        console.error(`Error setting module ${currentModuleId} as current training.\nException: ${e}`);
    } finally {
        next();
    }
};

const sectionTrainingGuard: NavigationGuard = async (to: any, from: any, next) => {
    const {currentSectionId} = store.state.section;
    try {
        await store.dispatch(TRAINING_ACTIONS.SET_CURRENT_MODULE_TRAINING, currentSectionId);
    } catch (e) {
        console.error(`Error setting section ${currentSectionId} as current training.\nException: ${e}`);
    } finally {
        next();
    }
};


export const CourseTrainingComponent = {
    beforeRouteEnter: courseTrainingGuard,
    beforeRouteUpdate: courseTrainingGuard
};

export const ModuleTrainingComponent = {
    beforeRouteEnter: moduleTrainingGuard,
    beforeRouteUpdate: moduleTrainingGuard
};

export const SectionTrainingComponent = {
    beforeRouteEnter: sectionTrainingGuard,
    beforeRouteUpdate: sectionTrainingGuard
};
