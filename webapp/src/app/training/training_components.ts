import {store} from "@webapp_root/app";
import {TRAINING_ACTIONS} from "@training/training_store";
import {NavigationGuard} from "vue-router";
import {mapState} from "vuex";
import {RootGetters, RootState} from "@webapp_root/store";
import {ComponentOptions} from "vue";
import {Vue} from "vue/types/vue";
import EditButtonsComponent from "@training/edit_buttons/edit_buttons_component.vue";

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
    const {currentModuleId} = store.state.course;
    try {
        if (!currentModuleId) throw new Error(`currentModuleId undefined!`);
        await store.dispatch(TRAINING_ACTIONS.SET_CURRENT_MODULE_TRAINING, currentModuleId);
        next();
    } catch (e) {
        console.error(`Error setting module ${currentModuleId} as current training.\nException: ${e}`);
        next(e);
    }
};

const sectionTrainingGuard: NavigationGuard = async (to: any, from: any, next) => {
    const {currentSectionId} = store.state.course;
    try {
        await store.dispatch(TRAINING_ACTIONS.SET_CURRENT_MODULE_TRAINING, currentSectionId);
    } catch (e) {
        console.error(`Error setting section ${currentSectionId} as current training.\nException: ${e}`);
    } finally {
        next();
    }
};

export const TrainingComponent: ComponentOptions<Vue> = {
    computed: {
        ...mapState<RootState>({
            loading: (state, {trainingLoading, currentCourseLoading}: RootGetters) =>
                trainingLoading || currentCourseLoading
        })
    },
    components: {
        'edit-buttons': EditButtonsComponent
    }
};

export const CourseTrainingComponent: ComponentOptions<Vue> = {
    beforeRouteEnter: courseTrainingGuard,
    beforeRouteUpdate: courseTrainingGuard,
    extends: TrainingComponent
};

export const ModuleTrainingComponent: ComponentOptions<Vue> = {
    beforeRouteEnter: moduleTrainingGuard,
    beforeRouteUpdate: moduleTrainingGuard,
    extends: TrainingComponent
};

export const SectionTrainingComponent: ComponentOptions<Vue> = {
    beforeRouteEnter: sectionTrainingGuard,
    beforeRouteUpdate: sectionTrainingGuard,
    extends: TrainingComponent
};
