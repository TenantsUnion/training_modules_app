import Vue from "vue";
import Component from "vue-class-component";
import {CreateCourseEntityPayload} from '@shared/courses';
import {FormState} from '../../vue-form';
import {Segment} from '@shared/segment';
import {COURSE_ACTIONS} from '@course/store/course_actions';
import {Location} from "vue-router";
import {ADMIN_COURSE_ROUTES, USER_ROUTES} from "@global/routes";
import {STATUS_MESSAGES_ACTIONS, TitleMessagesObj} from "@global/status_messages/status_messages_store";

@Component({
    data: () => {
        return {
            loading: false,
            errorMessages: null,
            course: {
                active: true,
                openEnrollment: true,
                title: '',
                description: '',
                timeEstimate: undefined,
                createdBy: '',
            },
            formstate: {},
            contentQuestions: []
        };
    },
})
export default class CreateCourseComponent extends Vue {
    errorMessages: {};
    loading: boolean;
    course: CreateCourseEntityPayload;
    contentQuestions: Segment[] = [];
    formstate: FormState;

    created () {
    }

    cancel () {
        this.$router.push(<Location>{name: USER_ROUTES.adminCourses});
    }

    async createCourse () {
        await this.dispatchCreateCourse(() => {
            this.$router.push(<Location>{name: USER_ROUTES.adminCourses})
        });
    }

    async createCourseEdit () {
        await this.dispatchCreateCourse((courseId: string) => {
            this.$router.push(<Location>{
                name: ADMIN_COURSE_ROUTES.editCourse,
                params: {
                    courseSlug: this.$store.getters.getSlugFromCourseId(courseId)
                }
            });
        });
    }

    private async dispatchCreateCourse (onSuccess: (courseId?: string) => any) {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }
        this.loading = true;
        this.errorMessages = null;
        let createCoursePayload = this.getCoursePayload();
        try {
            let courseId = await this.$store.dispatch(COURSE_ACTIONS.CREATE_COURSE, createCoursePayload);
            let message: TitleMessagesObj = {message: `Course: ${this.course.title} created successfully`};
            this.$store.dispatch(STATUS_MESSAGES_ACTIONS.SET_SUCCESS_MESSAGE, message);
            onSuccess(courseId);
        } catch (msg) {
            this.errorMessages = msg;
        } finally {
            this.loading = false;
        }
    }


    private getCoursePayload () {
        let createCoursePayload: CreateCourseEntityPayload = {
            title: this.course.title,
            timeEstimate: this.course.timeEstimate,
            submitIndividually: true,
            active: this.course.active,
            openEnrollment: this.course.openEnrollment,
            contentQuestions: {
                quillChanges: {},
                questionChanges: {},
                orderedContentQuestionIds: [],
                orderedContentIds: [],
                orderedQuestionIds: []
            },
            description: this.course.description
        };
        return createCoursePayload;
    }

    timeUpdated (time: number) {
        this.course.timeEstimate = time;
    }
}
