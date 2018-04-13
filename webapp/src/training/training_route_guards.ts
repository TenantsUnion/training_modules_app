import {NavigationGuard} from 'vue-router';
import {store} from '@store/store';
import {TRAINING_ACTIONS} from '@training/training_store';
import {Vue} from 'vue/types/vue';
import {ComponentOptions} from 'vue';
import {mapState} from 'vuex';
import {RootGetters, RootState} from '@store/store_types';

const courseTrainingGuard: NavigationGuard = async function (to: any, from: any, next) {
    const {currentCourseId} = store.state.course;
    try {
        store.dispatch(TRAINING_ACTIONS.SET_CURRENT_COURSE_TRAINING, currentCourseId);
    } catch (e) {
        console.error(`Error setting course ${currentCourseId} as current training.\nException: ${e}`);
    } finally {
        next();
    }
};

const moduleTrainingGuard: NavigationGuard = async function (to: any, from: any, next) {
    const {currentModuleId} = store.state.course;
    try {
        if (!currentModuleId) throw new Error(`currentModuleId undefined!`);
        store.dispatch(TRAINING_ACTIONS.SET_CURRENT_MODULE_TRAINING, currentModuleId);
        next();
    } catch (e) {
        console.error(`Error setting module ${currentModuleId} as current training.\nException: ${e}`);
        next(e);
    }
};

const sectionTrainingGuard: NavigationGuard = async function (to: any, from: any, next) {
    const {currentSectionId} = store.state.course;
    try {
        store.dispatch(TRAINING_ACTIONS.SET_CURRENT_MODULE_TRAINING, currentSectionId);
    } catch (e) {
        console.error(`Error setting section ${currentSectionId} as current training.\nException: ${e}`);
    } finally {
        next();
    }
};

export const trainingComponent: ComponentOptions<Vue> = {
    computed: {
        ...mapState<RootState>({
            loading: (state, {trainingLoading, currentCourseLoading}: RootGetters) =>
                trainingLoading || currentCourseLoading
        })
    }
};

export const CourseTrainingComponent: ComponentOptions<Vue> = {
    beforeRouteEnter: courseTrainingGuard,
    beforeRouteUpdate: courseTrainingGuard,
    extends: trainingComponent
};

export const ModuleTrainingComponent: ComponentOptions<Vue> = {
    beforeRouteEnter: moduleTrainingGuard,
    beforeRouteUpdate: moduleTrainingGuard,
    extends: trainingComponent
};

export const SectionTrainingComponent: ComponentOptions<Vue> = {
    beforeRouteEnter: sectionTrainingGuard,
    beforeRouteUpdate: sectionTrainingGuard,
    extends: trainingComponent
};


