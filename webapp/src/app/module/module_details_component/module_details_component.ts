import Vue from 'vue';
import Component from "vue-class-component";
import {mapGetters, mapState} from 'vuex';
import {NavigationGuard} from 'vue-router';
import {MODULE_ACTIONS} from "@module/store/module_actions";
import {CourseMode} from "@course/store/course_mutations";
import {QuestionSubmission, TrainingProgressUpdateData} from "@shared/user_progress";
import {ViewModuleData} from "@shared/modules";
import {USER_PROGRESS_ACTIONS} from "@user_progress/user_progress_store";
import {store} from "@webapp_root/app";

export const currentModuleRouteGuard: NavigationGuard = async (to, from, next) => {
    let slug = to.params.moduleSlug;
    if (!slug || slug === 'undefined') {
        throw new Error(`Invalid route ${to.fullPath}. Route param :moduleSlug must be defined`);
    }
    try {
        await store.dispatch(MODULE_ACTIONS.SET_CURRENT_MODULE_FROM_SLUG, {slug, mode: store.getters.mode});
    } catch (e) {
        console.error(`Error setting current course. ${e}`);
    } finally {
        next();
    }
};
@Component({
    computed: {
        ...mapGetters({
            loading: 'currentModuleLoading',
            module: 'currentModule',
        }),
        ...mapState({
            isCourseAdmin: ({course: {mode}}) => {
                return mode === CourseMode.ADMIN
            }
        })
    },
    beforeRouteUpdate: currentModuleRouteGuard,
    beforeRouteEnter: currentModuleRouteGuard
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

