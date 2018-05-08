import Component from 'vue-class-component';
import Vue from 'vue';
import VueForm from '@webapp/types/vue-form';
import {CreateSectionEntityPayload} from '@shared/sections';
import {TRAINING_ROUTES} from "@webapp/global/routes";
import {STATUS_MESSAGES_ACTIONS, TitleMessagesObj} from "@webapp/global/status_messages/status_messages_store";
import {EDIT_TRAINING_ACTIONS} from "@webapp/training/edit_training_store/edit_training_actions_store";

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
})
export default class CreateSectionComponent extends Vue {
    errorMessages: { [index: string]: string };
    loading: boolean;
    title: string;
    timeEstimate: number;
    description: string;
    formstate: VueForm.FormState;

    async createSection() {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }

        this.loading = true;
        this.errorMessages = null;

        let {currentModuleId} = this.$state.course;
        try {
            const createSectionPayload: CreateSectionEntityPayload = {
                title: this.title,
                description: this.description,
                timeEstimate: this.timeEstimate,
                submitIndividually: false,
                active: true,
                courseId: this.$state.course.currentCourseId,
                moduleId: currentModuleId,
                contentQuestions: {
                    quillChanges: {},
                    orderedContentQuestionIds: [],
                    orderedContentIds: [],
                    orderedQuestionIds: [],
                    questionChanges: {}
                },
            };
            let sectionId = await this.$store.dispatch(EDIT_TRAINING_ACTIONS.CREATE_SECTION, createSectionPayload);
            let message: TitleMessagesObj = {message: `Section: ${this.title} created successfully`};
            this.$store.dispatch(STATUS_MESSAGES_ACTIONS.SET_SUCCESS_MESSAGE, message);

            let {getSectionSlugFromId} = this.$store.getters;
            this.$router.push({
                name: TRAINING_ROUTES.section,
                params: {
                    sectionSlug: getSectionSlugFromId({moduleId: currentModuleId, sectionId})
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
