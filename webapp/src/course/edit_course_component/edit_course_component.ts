import Vue from "vue";
import Component from "vue-class-component";
import {mapGetters, mapState} from 'vuex';
import {RootGetters, RootState} from '@store/store_types';
import {Watch} from 'vue-property-decorator';
import {diffBasicPropsCourseProps, SaveCourseEntityPayload, ViewCourseData} from '@shared/courses';
import EditTrainingSegmentsComponent from "@webapp/training/edit_training_segments/edit_training_segments_component";
import {PREVIEW_COURSE_ROUTES} from "@webapp/global/routes";
import {STATUS_MESSAGES_ACTIONS, TitleMessagesObj} from "@webapp/global/status_messages/status_messages_store";
import {CourseTrainingComponent} from "@webapp/training/training_components";
import {EDIT_COURSE_COMMAND_ACTIONS} from "@webapp/course/edit_course_command_store";
import VueForm from "@webapp/types/vue-form";

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
    extends: CourseTrainingComponent,
    computed: {
        ...mapGetters({
            getSlugFromCourseId: 'getSlugFromCourseId'
        }),
        ...mapState<RootState>({
            storedCourse: (state, {currentTraining}: RootGetters) => currentTraining
        })
    }
})
export class EditCourseComponent extends Vue {
    saving: boolean;
    errorMessages: {};
    formstate: VueForm.FormState;
    course: ViewCourseData;
    storedCourse: ViewCourseData;

    @Watch('storedCourse', {immediate: true})
    updateCourse (storedCourse: ViewCourseData) {
        if (storedCourse) {
            let course = {...storedCourse};
            Vue.set(this, 'course', course);
        }
    }

    async save() {
        console.log('this shouldn\'t print')
    }
    async saved () {


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
            await this.$store.dispatch(EDIT_COURSE_COMMAND_ACTIONS.SAVE_COURSE, saveCoursePayload);
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
                courseSlug: this.$store.getters.getSlugFromCourseId(this.storedCourse.id)
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
