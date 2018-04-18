import {mapState} from "vuex";
import {RootGetters} from "@store/store_types";
import Vue from "vue";
import Component from 'vue-class-component';
import TrainingSegmentsComponent from "./training_segments/training_segments_component.vue";
import SubTrainingComponent from "./sub_training/sub_training_component.vue";
import TrainingPanelComponent from "./training_panel/training_panel_component.vue";
import {QuestionSubmission} from '@shared/user_progress';
import {
    ContentQuestionsDelta,
    SaveTrainingEntityPayload,
    TrainingEntityDiffDelta,
} from '@shared/training';
import {Prop} from 'vue-property-decorator';
import TimeEstimateComponent from '@training/time_estimate/time_estimate_component.vue';
import TrainingTitleComponent from '@training/training_title/training_title_component.vue';
import TrainingDescriptionComponent from '@training/description/training_description_component.vue';


export interface TrainingCallbacksConfig<T extends TrainingEntityDiffDelta = TrainingEntityDiffDelta> {
    individualSubmitCb(submission: QuestionSubmission): Promise<any>;
    submitCb(submissions: QuestionSubmission[]): Promise<any>;
    saveTraining(payload: SaveTrainingEntityPayload<T>);
    // todo save subtraining functionality
    saveSubTraining(payload: any);
}

interface SubTraining {
    title: string;
    description?: string;
    timeEstimate?: number;
    subTrainingsLabel?: string;
    subTrainings?: SubTraining[];
}

@Component({
    components: {
        'training-segments': TrainingSegmentsComponent,
        'training-panel': TrainingPanelComponent,
        'sub-training': SubTrainingComponent,
        'time-estimate': TimeEstimateComponent,
        'training-title': TrainingTitleComponent,
        'training-description': TrainingDescriptionComponent
    },
    computed: {
        ...mapState({
            loading: (rootState, {trainingLoading}: RootGetters) => trainingLoading,
            training: (rootState, {currentTraining}: RootGetters) => currentTraining
        })
    }
})
export class TrainingComponent extends Vue {
    @Prop({required: true})
    callbacksConfig?: TrainingCallbacksConfig;

    getContentQuestionsDelta (): ContentQuestionsDelta {
        return null;
    }

    getTrainingDiffDelta(): TrainingEntityDiffDelta {
       return null;
    }
}

export default TrainingComponent;

