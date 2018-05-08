import Vue from "vue";
import Component from "vue-class-component";
import {mapState} from 'vuex';
import {RootGetters, RootState} from '@store/store_types';
import {Watch} from 'vue-property-decorator';
import {SaveCourseEntityPayload, ViewCourseData} from '@shared/courses';
import {TRAINING_ROUTES} from "@webapp/global/routes";
import {STATUS_MESSAGES_ACTIONS, TitleMessagesObj} from "@webapp/global/status_messages/status_messages_store";
import {EDIT_TRAINING_ACTIONS} from "@webapp/training/edit_training_store/edit_training_actions_store";
import VueForm from "@webapp/types/vue-form";
import {CourseTrainingComponent} from '@training/training_route_guards';

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

    async save () {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }

        this.errorMessages = null;

        let changes = null;

        let saveCoursePayload: SaveCourseEntityPayload = {
            id: this.storedCourse.id, changes
        };

        try {
            this.saving = true;
            await this.$store.dispatch(EDIT_TRAINING_ACTIONS.SAVE_EDITS, saveCoursePayload);
            let message: TitleMessagesObj = {message: `Course: ${this.course.title} saved successfully`};
            this.$store.dispatch(STATUS_MESSAGES_ACTIONS.SET_SUCCESS_MESSAGE, message);
        } catch (error) {
            console.error(error.stack);
            this.errorMessages = error.message;
        } finally {
            this.saving = false;
        }

        this.$router.push({
            name: TRAINING_ROUTES.course,
            params: {
                courseSlug: this.$store.getters.getSlugFromCourseId(this.storedCourse.id)
            }
        });
    }

    cancel () {
        this.$router.push({name: TRAINING_ROUTES.course})
    }

    timeEstimateUpdated (time) {
        this.course.timeEstimate = time;
    }
}

export default EditCourseComponent;
