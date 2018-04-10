import {store} from "@store/store";
import {TRAINING_ACTIONS} from "@webapp/training/training_store";
import {NavigationGuard} from "vue-router";
import {mapState} from "vuex";
import {RootGetters, RootState} from "@store/store_types";
import {ComponentOptions} from "vue";
import EditActionsButtonsComponent from "@webapp/training/edit/edit_actions_buttons/edit_actions_buttons_component.vue";
import Vue from "vue";
import Component from 'vue-class-component';
import TrainingSegmentsComponent from "./training_segments/training_segments_component.vue";
import SubTrainingComponent from "./sub_training/sub_training_component.vue";


interface SubTraining {
    title: string;
    description?: string;
    timeEstimate?: number;
    subTrainingsLabel?: string;
    subTrainings?: SubTraining[]
}

@Component({
    components: {
        'training-segments': TrainingSegmentsComponent,
        'sub-training': SubTrainingComponent
    }
})
export default class TrainingComponent extends Vue {
    title: string;
    description: string;
    subTrainingsLabel: string;
    trainingSegments: any[];
    subTrainings: any[];
}

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

const sectionTrainingGuard: NavigationGuard = async function (this: Vue, to: any, from: any, next) {
    const {currentSectionId} = this.$store.state.course;
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
    },
    components: {
        'edit-actions-buttons': EditActionsButtonsComponent
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


