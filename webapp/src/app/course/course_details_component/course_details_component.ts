import Vue from 'vue';
import Component from "vue-class-component";
import {mapGetters, mapState} from 'vuex';
import {QuestionSubmission, TrainingProgressUpdateData} from "@shared/user_progress";
import {ViewCourseData} from "@shared/courses";
import {USER_PROGRESS_ACTIONS} from "@user_progress/user_progress_store";
import {CourseTrainingComponent} from "@training/training_components";
import {RootGetters, RootState} from "@webapp_root/store";

@Component({
    extends: CourseTrainingComponent,
    computed: {
        ...mapGetters(['currentCourseLoading']),
        ...mapState({
            currentCourse: (state: RootState, getters: RootGetters) => getters.currentTraining,
        })
    },
})
export default class CourseDetailsComponent extends Vue {
    currentCourse: ViewCourseData;

    async individualSubmitCb (submission: QuestionSubmission) {
        let progress: TrainingProgressUpdateData = {
            id: this.currentCourse.id,
            questionSubmissions: [submission],
            viewedContentIds: []
        };
        await this.$store.dispatch(USER_PROGRESS_ACTIONS.SAVE_COURSE_PROGRESS, progress);
    }

    async submitCb (submissions: QuestionSubmission[]) {
        let progress: TrainingProgressUpdateData = {
            id: this.currentCourse.id,
            questionSubmissions: submissions,
            viewedContentIds: []
        };
        await this.$store.dispatch(USER_PROGRESS_ACTIONS.SAVE_COURSE_PROGRESS, progress);
    }
}
