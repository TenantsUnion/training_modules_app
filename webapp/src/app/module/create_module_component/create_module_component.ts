import * as VueForm from "../../vue-form";
import Vue from 'vue';
import Component from 'vue-class-component';
import {Segment} from "@shared/segment";
import {Location} from 'vue-router';
import {CreateModuleEntityPayload} from "@shared/modules";
import {PREVIEW_COURSE_ROUTES} from "@global/routes";
import {STATUS_MESSAGES_ACTIONS, TitleMessagesObj} from "@global/status_messages/status_messages_store";
import {COURSE_MUTATIONS} from "@course/course_store";
import {EDIT_COURSE_COMMAND_ACTIONS} from "@course/edit_course_command_store";

@Component({
    data: () => {
        return {
            active: true,
            loading: false,
            errorMessages: null,
            title: '',
            timeEstimate: null,
            description: '',
            formstate: {}
        }
    },
})
export default class CreateModuleComponent extends Vue {
    errorMessages: {};
    loading: boolean;
    title: string;
    timeEstimate: number;
    description: string;
    active: boolean;
    formstate: VueForm.FormState;
    quillContent: Segment[] = [];

    async createModule () {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }

        this.loading = true;
        this.errorMessages = null;

        try {
            let createModulePayload: CreateModuleEntityPayload = <CreateModuleEntityPayload> {
                title: this.title,
                description: this.description,
                timeEstimate: this.timeEstimate,
                active: this.active,
                submitIndividually: true,
                courseId: <string> this.$store.state.course.currentCourseId,
                contentQuestions: {
                    quillChanges: {},
                    questionChanges: {},
                    orderedContentQuestionIds: [],
                    orderedContentIds: [],
                    orderedQuestionIds: []
                }
            };
            let moduleId = await this.$store.dispatch(EDIT_COURSE_COMMAND_ACTIONS.CREATE_MODULE, createModulePayload);
            let message: TitleMessagesObj = {message: `Module: ${this.title} created successfully`};
            this.$store.dispatch(STATUS_MESSAGES_ACTIONS.SET_SUCCESS_MESSAGE, message);
            this.$store.commit(COURSE_MUTATIONS.SET_CURRENT_MODULE, moduleId);
            this.$router.push(<Location>{
                name: PREVIEW_COURSE_ROUTES.modulePreview,
                params: {moduleSlug: this.$store.getters.getModuleSlugFromId(moduleId)}
            });
        } catch (errorMessages) {
            console.error(errorMessages);
            // todo check if error message object from server and display, if not print stack trace since it is likely a client thrown error
            this.errorMessages = errorMessages;
        } finally {
            this.loading = false;
        }
    }

    timeEstimateUpdated (time) {
        this.timeEstimate = time;
    }
}

