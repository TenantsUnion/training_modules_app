import Vue from "vue";
import Component from "vue-class-component";
import {mapGetters, mapState} from 'vuex';
import {RootGetters, RootState} from '@webapp_root/store';
import {Watch} from 'vue-property-decorator';
import * as VueForm from '../../vue-form';
import {COURSE_ACTIONS} from '../store/course_actions';
import {diffBasicPropsCourseProps, SaveCourseEntityPayload, ViewCourseData} from '@shared/courses';
import {getSlugFromCourseIdFn} from '@user/store/courses_listing_store';
import EditTrainingSegmentsComponent from "@global/edit_training_segments/edit_training_segments_component";
import {PREVIEW_COURSE_ROUTES} from "@global/routes";
import {STATUS_MESSAGES_ACTIONS, TitleMessagesObj} from "@global/status_messages/status_messages_store";

@Component({
    data: () => {
        return {
            errorMessages: '',
            formstate: {},
            course: null,
            modules: [],
            saving: false
        };
    },
    computed: {
        ...mapGetters({
            storedCourse: 'currentCourse',
            getSlugFromCourseId: 'getSlugFromCourseId'
        }),
        ...mapState({
            loading: (state: RootState, getters: RootGetters) => {
                return !getters.currentCourse || getters.currentCourseLoading;
            }
        }),

    },
})
export class EditCourseComponent extends Vue {
    saving: boolean;
    errorMessages: {};
    // quillContent: Segment[] = [];
    formstate: VueForm.FormState;
    course: ViewCourseData;
    storedCourse: ViewCourseData;
    getSlugFromCourseId: getSlugFromCourseIdFn;

    @Watch('storedCourse', {immediate: true})
    updateCourse (storedCourse: ViewCourseData) {
        if (storedCourse) {
            let course = {...storedCourse};
            Vue.set(this, 'course', course);
        }
    }

    async save () {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }

        this.errorMessages = null;

        let changes = diffBasicPropsCourseProps(this.storedCourse, this.course);
        let contentQuestions = (<EditTrainingSegmentsComponent> this.$refs.trainingSegment).getContentQuestionsDelta();

        let saveCoursePayload: SaveCourseEntityPayload = {
            id: this.storedCourse.id, changes, contentQuestions
        };

        try {
            this.saving = true;
            await this.$store.dispatch(COURSE_ACTIONS.SAVE_COURSE, saveCoursePayload);
            let message: TitleMessagesObj = {message: `Course: ${this.course.title} saved successfully`};
            this.$store.dispatch(STATUS_MESSAGES_ACTIONS.SET_SUCCESS_MESSAGE, message);
        } catch (error) {
            console.error(error.stack);
            this.errorMessages = error.message;
        } finally {
            this.saving = false;
        }

        this.$router.push({
            name: PREVIEW_COURSE_ROUTES.coursePreview,
            params: {
                courseSlug: this.getSlugFromCourseId(this.storedCourse.id)
            }
        });
    }

    cancel () {
        this.$router.push({name: PREVIEW_COURSE_ROUTES.coursePreview})
    }

    timeEstimateUpdated (time) {
        this.course.timeEstimate = time;
    }
}

export default EditCourseComponent;
