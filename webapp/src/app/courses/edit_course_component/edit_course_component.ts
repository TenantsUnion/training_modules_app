import Vue from "vue";
import Component from "vue-class-component";
import {COURSES_ROUTE_NAMES} from '../courses_routes';
import {mapGetters, mapState} from 'vuex';
import {RootGetters, RootState} from '../../state_store';
import {Watch} from 'vue-property-decorator';
import * as VueForm from '../../vue-form';
import {COURSE_ACTIONS} from '../store/course/course_actions';
import {
    CourseEntityDiffDelta, diffBasicPropsCourseProps, SaveCourseEntityPayload, ViewCourseData
} from '@shared/courses';
import {getSlugFromCourseIdFn} from '../store/courses_listing/courses_listing_store';
import EditTrainingSegmentsComponent from "@global/edit_training_segments/edit_training_segments_component";

let Delta = Quill.import('delta');


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
        let course = {...storedCourse};
        Vue.set(this, 'course', course);
    }

    async save () {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }

        this.errorMessages = null;

        let changes = diffBasicPropsCourseProps(this.storedCourse, this.course);
        let contentQuestions =  (<EditTrainingSegmentsComponent> this.$refs.trainingSegment).getContentQuestionsDelta();

        let saveCoursePayload: SaveCourseEntityPayload = {
            id: this.storedCourse.id,
            changes: {
                ...changes,
                ...contentQuestions
            }
        };

        try {
            this.saving = true;
            await this.$store.dispatch(COURSE_ACTIONS.SAVE_COURSE, saveCoursePayload);
        } catch (error) {
            console.error(error.stack);
            this.errorMessages = error.message;
        } finally {
            this.saving = false;
        }

        this.$router.push({
            name: COURSES_ROUTE_NAMES.adminCourseDetails,
            params: {
                courseSlug: this.getSlugFromCourseId(this.storedCourse.id)
            }
        });
    }

    cancel () {
        this.$router.push({name: COURSES_ROUTE_NAMES.adminCourseDetails})
    }

    timeEstimateUpdated (time) {
        this.course.timeEstimate = time;
    }
}

export default EditCourseComponent;
