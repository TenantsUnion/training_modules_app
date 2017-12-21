import Vue from "vue";
import Component from "vue-class-component";
import {COURSES_ROUTE_NAMES} from '../courses_routes';
import * as _ from "underscore";
import {Segment} from '../../../../../shared/segment';
import {SegmentViewerComponent} from '../../global/segment_viewer/segment_viewer_component';
import {mapGetters, mapState} from 'vuex';
import {RootGetters, RootState} from '../../state_store';
import {Watch} from 'vue-property-decorator';
import * as VueForm from '../../vue-form';
import {deltaArrayDiff} from '../../../../../shared/delta/diff_key_array';
import {COURSE_ACTIONS} from '../store/course/course_actions';
import {
    CourseEntityDiffDelta, diffBasicPropsCourseProps, SaveCourseEntityPayload,
    ViewCourseQuillData
} from '../../../../../shared/courses';

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
        ...mapGetters(['currentCourse', 'getCourseSlugFromId']),
        ...mapState({
            loading: (state: RootState, getters: RootGetters) => {
                return !getters.currentCourse || getters.currentCourseLoading;
            }
        })

    },
    template: require('./edit_course_component.tpl.html'),
})
export class EditCourseComponent extends Vue {
    saving: boolean;
    errorMessages: {};
    quillContent: Segment[] = [];
    formstate: VueForm.FormState;
    course: ViewCourseQuillData;
    currentCourse: ViewCourseQuillData;

    @Watch('currentCourse', {immediate: true})
    updateCourse(currentCourse: ViewCourseQuillData) {
        let course = currentCourse ? _.extend({}, currentCourse) : this.course;
        let quillContent = currentCourse ? _.map(currentCourse.content, (content) => {
            return _.extend({}, content, {
                removeCallback: () => {
                    // add callback that removes content element from component array before passing to segment viewer
                    let rmIndex = this.quillContent.findIndex((el) => el.id === content.id);
                    this.quillContent.splice(rmIndex, 1);
                }
            });
        }) : [];
        Vue.set(this, 'course', course);
        Vue.set(this, 'quillContent', quillContent);
    }

    async save() {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }

        this.errorMessages = null;

        // primitive keys diff
        let changes: CourseEntityDiffDelta = diffBasicPropsCourseProps(this.currentCourse, this.course);

        // quill content diff
        changes.changeQuillContent = (<SegmentViewerComponent> this.$refs.segmentViewer).getContentChanges();

        // ordered content ids diff
        let userChangedOrderedContentIds: string[] = this.quillContent.map(({id}) => id);
        let {orderedContentIds} = this.currentCourse;
        changes.orderedContentIds = deltaArrayDiff(orderedContentIds, userChangedOrderedContentIds);
        // todo question handling
        changes.orderedContentQuestionIds = deltaArrayDiff(orderedContentIds, userChangedOrderedContentIds);

        let saveCoursePayload: SaveCourseEntityPayload = {
            id: this.currentCourse.id,
            changes
        };

        try {
            this.saving = true;
            await this.$store.dispatch(COURSE_ACTIONS.SAVE_COURSE, saveCoursePayload);
        } catch (error) {
            console.error(error.stack);
            this.errorMessages = error.message;
        } finally  {
            this.saving = false;
        }

        // this.$router.push({
        //     name: COURSES_ROUTE_NAMES.adminCourseDetails
        //
        // });
        // rewrite with store
        // get registered course module store
        // trigger action of saving course diff
        // pass in current user updates as payload  -- get delta diff from segment viewer and pass in current field values
        // coursesService.saveCourse({
        //     id: this.courseVm.id,
        //     version: this.courseVm.version,
        //     fieldDeltas: {
        //         changeQuillContent: contentChanges
        //     },
        //     updatedByUserId: userQueryService.getUserId(),
        // }).then(() => {
        // }).catch((msg) => {
        //     this.errorMessages = msg;
        // })
    }

    cancel() {
        this.$router.push({name: COURSES_ROUTE_NAMES.adminCourseDetails})
    }

    timeEstimateUpdated(time) {
        this.course.timeEstimate = time;
    }

    addContentCallback(addContentId: string) {
        this.quillContent.push({
            id: addContentId,
            type: 'CONTENT',
            removeCallback: () => {
                let rmIndex = this.quillContent.findIndex((el) => el.id === addContentId);
                this.quillContent.splice(rmIndex, 1);
            }
        });
    }
}
