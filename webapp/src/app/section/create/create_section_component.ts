import Component from 'vue-class-component';
import Vue from 'vue';
import * as VueForm from '../../vue-form';
import {Segment} from '@shared/segment';
import {SECTION_ACTIONS} from '@section/store/section_actions';
import {CreateSectionEntityPayload} from '@shared/sections';
import {currentModuleRouteGuard} from '@module/module_details_component/module_details_component';
import {PREVIEW_COURSE_ROUTES} from "@global/routes";

@Component({
    data: () => {
        return {
            loading: false,
            errorMessages: null,
            title: null,
            timeEstimate: null,
            description: null,
            formstate: {}
        };
    },
    beforeRouteEnter: currentModuleRouteGuard,
    beforeRouteUpdate: currentModuleRouteGuard,
})
export default class CreateSectionComponent extends Vue {
    errorMessages: { [index: string]: string };
    loading: boolean;
    title: string;
    timeEstimate: number;
    description: string;
    formstate: VueForm.FormState;
    quillContent: Segment[] = [];

    async createSection() {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }

        this.loading = true;
        this.errorMessages = null;

        let {currentModuleId} = this.$store.state.module;
        try {
            const createSectionPayload: CreateSectionEntityPayload = {
                title: this.title,
                description: this.description,
                timeEstimate: this.timeEstimate,
                submitIndividually: false, // todo make field
                active: true, // todo make field
                courseId: this.$store.state.course.currentCourseId,
                moduleId: currentModuleId,
                contentQuestions: {
                    quillChanges: {},
                    orderedContentQuestionIds: [],
                    orderedContentIds: [],
                    orderedQuestionIds: [],
                    questionChanges: {}
                },
            };
            await this.$store.dispatch(SECTION_ACTIONS.CREATE_SECTION, createSectionPayload);

            let {getSectionSlugFromId} = this.$store.getters;
            let {currentSectionId} = this.$store.state.section;
            this.$router.push({
                name: PREVIEW_COURSE_ROUTES.sectionPreview,
                params: {
                    sectionSlug: getSectionSlugFromId({moduleId: currentModuleId, sectionId: currentSectionId})
                },
            });
        } catch (errorMessages) {
            console.error(errorMessages);
            this.errorMessages = errorMessages;
        } finally {
            this.loading = false;
        }

    }

    timeEstimateUpdated(time) {
        this.timeEstimate = time;
    }
}
