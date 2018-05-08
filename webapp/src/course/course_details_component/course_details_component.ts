import Vue from 'vue';
import Component from "vue-class-component";
import {mapState} from 'vuex';
import {QuestionSubmission, TrainingProgressUpdateData} from "@shared/user_progress";
import {SaveCourseEntityPayload, ViewCourseData} from "@shared/courses";
import {USER_PROGRESS_ACTIONS} from "@webapp/user_progress/user_progress_store";
import {RootGetters, RootState} from "@store/store_types";
import {CourseTrainingComponent} from '@training/training_route_guards';
import TrainingComponentVue from '@training/training_component.vue'
import {TrainingCallbacksConfig, TrainingComponent} from '@training/training_component';
import {TrainingEntityDelta} from '@shared/training';
import {STATUS_MESSAGES_ACTIONS, TitleMessagesObj} from '@global/status_messages/status_messages_store';
import {EDIT_TRAINING_ACTIONS} from '@training/edit_training_store/edit_training_actions_store';

@Component({
    extends: CourseTrainingComponent,
    components: {
        'training': TrainingComponentVue
    },
    computed: {
        ...mapState<RootState>({
            course: (state, {currentTraining}: RootGetters) => currentTraining,
        })
    },
})
export default class CourseDetailsComponent extends Vue {
    course!: ViewCourseData;
    errorMessages: {};

    async individualSubmitCb(submission: QuestionSubmission) {
        let progress: TrainingProgressUpdateData = {
            id: this.course.id,
            questionSubmissions: [submission],
            viewedContentIds: []
        };
        await this.$store.dispatch(USER_PROGRESS_ACTIONS.SAVE_COURSE_PROGRESS, progress);
    }

    async submitCb(submissions: QuestionSubmission[]) {
        let progress: TrainingProgressUpdateData = {
            id: this.course.id,
            questionSubmissions: submissions,
            viewedContentIds: []
        };
        await this.$store.dispatch(USER_PROGRESS_ACTIONS.SAVE_COURSE_PROGRESS, progress);
    }

    async save() {
        this.errorMessages = null;

        let changes: TrainingEntityDelta = (<TrainingComponent> this.$refs.training).getTrainingDiffDelta();

        let saveCoursePayload: SaveCourseEntityPayload = {
            id: this.course.id, changes
        };

        try {
            await this.$store.dispatch(EDIT_TRAINING_ACTIONS.SAVE_EDITS, saveCoursePayload);
            let message: TitleMessagesObj = {message: `Course: ${this.course.title} saved successfully`};
            this.$store.dispatch(STATUS_MESSAGES_ACTIONS.SET_SUCCESS_MESSAGE, message);
        } catch (error) {
            console.error(error.stack);
            this.errorMessages = error.message;
        }
    }

    get trainingCallbacksConfig(): TrainingCallbacksConfig {
        return {
            individualSubmitCb: submission => this.individualSubmitCb(submission),
            submitCb: submissions => this.submitCb(submissions),
            saveTraining: () => this.save(),
            saveSubTraining: () => null
        }
    }
}
