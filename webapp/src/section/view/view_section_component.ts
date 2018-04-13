import Vue from 'vue';
import Component from 'vue-class-component';
import {mapGetters, mapState} from 'vuex';
import {TRAINING_ROUTES} from "@webapp/global/routes";
import {
    QuestionSubmission, TrainingProgressUpdateData
} from "@shared/user_progress";
import {ViewSectionData} from "@shared/sections";
import {USER_PROGRESS_ACTIONS} from "@webapp/user_progress/user_progress_store";
import {RootGetters, RootState} from "@store/store_types";
import {COURSE_ACTIONS} from "@webapp/course/course_store";
import {SectionTrainingComponent} from '@training/training_route_guards';


@Component({
    computed: {
        ...mapGetters({
            isCourseAdmin: 'isAdmin',
            previousSectionId: 'previousSectionIdInModule',
            nextSectionId: 'nextSectionIdInModule'
        }),
        ...mapState<RootState>({
            loading: (state: RootState, getters: RootGetters) => {
                return getters.currentCourseLoading || getters.trainingLoading;
            },
            section: (state: RootState, {currentTraining}: RootGetters) => currentTraining
        })
    },
    extends: SectionTrainingComponent,
})
export default class ViewSectionComponent extends Vue {
    section: ViewSectionData;

    async individualSubmitCb (submission: QuestionSubmission) {
        let progress: TrainingProgressUpdateData = {
            id: this.section.id,
            questionSubmissions: [submission],
            viewedContentIds: []
        };
        await this.$store.dispatch(USER_PROGRESS_ACTIONS.SAVE_SECTION_PROGRESS, progress);
    }

    async submitCb (submissions: QuestionSubmission[]) {
        let progress: TrainingProgressUpdateData = {
            id: this.section.id,
            questionSubmissions: submissions,
            viewedContentIds: []
        };
        await this.$store.dispatch(USER_PROGRESS_ACTIONS.SAVE_SECTION_PROGRESS, progress);
    }

    async next () {
        let moduleId = this.$state.course.currentModuleId;
        let nextId = this.$getters.nextSectionIdInModule;
        if (!nextId) {
            return;
        }
        let sectionSlug = this.$getters.getSectionSlugFromId({sectionId: nextId, moduleId});
        await this.$store.dispatch(COURSE_ACTIONS.NEXT_SECTION);

        this.$router.push({
            name: TRAINING_ROUTES.section,
            params: {sectionSlug}
        })
    }

    async back () {
        let moduleId = this.$state.course.currentModuleId;
        let previousId = this.$getters.previousSectionIdInModule;
        if (!previousId) {
            return;
        }
        let sectionSlug = this.$getters.getSectionSlugFromId({sectionId: previousId, moduleId});
        await this.$store.dispatch(COURSE_ACTIONS.NEXT_SECTION);

        this.$router.push({
            name: TRAINING_ROUTES.section,
            params: {sectionSlug}
        })
    }
}