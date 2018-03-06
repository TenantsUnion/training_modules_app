import Vue from 'vue';
import Component from 'vue-class-component';
import {CourseRefreshComponent} from '@global/refresh_route';
import {NavigationGuard} from 'vue-router';
import {SECTION_ACTIONS} from '@section/store/section_actions';
import {MODULE_ACTIONS} from '@module/store/module_actions';
import {mapGetters, mapState} from 'vuex';
import {PREVIEW_COURSE_ROUTES} from "@global/routes";
import {
    QuestionSubmission, TrainingProgressUpdateData
} from "@shared/user_progress";
import {ViewSectionData} from "@shared/sections";
import {USER_PROGRESS_ACTIONS} from "@user_progress/user_progress_store";
import {store} from "@webapp_root/app";
import {RootGetters, RootState} from "@webapp_root/state_store";

export const currentSectionRouteGuard: NavigationGuard = async (to, from, next) => {
    let courseSlug = to.params.courseSlug;
    let moduleSlug = to.params.moduleSlug;
    let sectionSlug = to.params.sectionSlug;
    if (!courseSlug || courseSlug === 'undefined'
        || !moduleSlug || moduleSlug === 'undefined'
        || !sectionSlug || sectionSlug === 'undefined') {
        throw new Error(`Invalid route ${to.fullPath}.
        Route params :moduleSlug, :sectionSlug, :courseSlug must be defined`);
    }
    try {
        const mode = store.getters.getUserCourseModeFromSlug(courseSlug);
        await store.dispatch(MODULE_ACTIONS.SET_CURRENT_MODULE_FROM_SLUG, {slug: moduleSlug, mode});
        await store.dispatch(SECTION_ACTIONS.SET_CURRENT_SECTION_FROM_SLUG, {
            sectionSlug,
            moduleId: store.state.module.currentModuleId,
            mode
        });
    } catch (e) {
        console.error(`Error setting current course. ${e}`);
    } finally {
        next();
    }
};

@Component({
    computed: {
        ...mapGetters({
            section: 'currentSection',
            isCourseAdmin: 'isAdmin',
            previousSectionId: 'previousSectionIdInModule',
            nextSectionId: 'nextSectionIdInModule'
        }),
        ...mapState({
            loading: (state: RootState, getters: RootGetters) => {
                return !getters.currentSection || getters.currentSectionLoading
                    || getters.currentCourseLoading || getters.currentModuleLoading;
            }
        })
    },
    beforeRouteUpdate: currentSectionRouteGuard,
    beforeRouteEnter: currentSectionRouteGuard,
    extends: CourseRefreshComponent,
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
        let moduleId = this.$store.state.module.currentModuleId;
        let nextId = this.$store.getters.nextSectionIdInModule;
        if (!nextId) {
            return;
        }
        let sectionSlug = this.$store.getters.getSectionSlugFromId({sectionId: nextId, moduleId});
        await this.$store.dispatch(SECTION_ACTIONS.NEXT_SECTION);

        this.$router.push({
            name: PREVIEW_COURSE_ROUTES.sectionPreview,
            params: {sectionSlug}
        })
    }

    async back () {
        let moduleId = this.$store.state.module.currentModuleId;
        let previousId = this.$store.getters.previousSectionIdInModule;
        if (!previousId) {
            return;
        }
        let sectionSlug = this.$store.getters.getSectionSlugFromId({sectionId: previousId, moduleId});
        await this.$store.dispatch(SECTION_ACTIONS.NEXT_SECTION);

        this.$router.push({
            name: PREVIEW_COURSE_ROUTES.sectionPreview,
            params: {sectionSlug}
        })
    }
}