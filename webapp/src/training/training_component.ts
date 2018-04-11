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
import TrainingPanelComponent from "./training_panel/training_panel_component.vue";
import {QuestionSubmission} from '@shared/user_progress';
import {
    ContentQuestionsDelta,
    SaveTrainingEntityPayload,
    TrainingEntityDiffDelta,
    TrainingView
} from '@shared/training';
import {Prop} from 'vue-property-decorator';


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
    subTrainings?: SubTraining[]
}

@Component({
    components: {
        'training-segments': TrainingSegmentsComponent,
        'training-panel': TrainingPanelComponent,
        'sub-training': SubTrainingComponent,
    },
    computed: {
        ...mapState({
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

