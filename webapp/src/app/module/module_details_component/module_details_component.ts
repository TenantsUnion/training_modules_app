import Vue from 'vue';
import Component from "vue-class-component";
import {mapState} from 'vuex';
import {QuestionSubmission, TrainingProgressUpdateData} from "@shared/user_progress";
import {ViewModuleData} from "@shared/modules";
import {USER_PROGRESS_ACTIONS} from "@user_progress/user_progress_store";
import {CourseMode} from "@course/course_store";
import {ModuleTrainingComponent} from "@training/training_components";
import {RootGetters, RootState} from "@webapp_root/store";

@Component({
    computed: {
        ...mapState<RootState>({
            isCourseAdmin: (state, {currentCourseMode: mode}: RootGetters) => mode === CourseMode.ADMIN,
            module: (state, {currentTraining}: RootGetters) => currentTraining
        })
    },
    extends: ModuleTrainingComponent
})
export default class ModuleDetailsComponent extends Vue {
    module: ViewModuleData;
    loading: boolean;

    async individualSubmitCb (submission: QuestionSubmission) {
        let progress: TrainingProgressUpdateData = {
            id: this.module.id,
            questionSubmissions: [submission],
            viewedContentIds: []
        };
        await this.$store.dispatch(USER_PROGRESS_ACTIONS.SAVE_MODULE_PROGRESS, progress);
    }

    async submitCb (submissions: QuestionSubmission[]) {
        let progress: TrainingProgressUpdateData = {
            id: this.module.id,
            questionSubmissions: submissions,
            viewedContentIds: []
        };
        await this.$store.dispatch(USER_PROGRESS_ACTIONS.SAVE_MODULE_PROGRESS, progress);
    }
}

