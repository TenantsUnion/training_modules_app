import Vue from "vue";
import Component from "vue-class-component";
import {coursesService} from '../courses_service';
import {ViewCourseQuillData, CourseEntityDeltas, CourseEntity} from 'courses.ts';
import {COURSES_ROUTE_NAMES} from '../courses_routes';
import {userQueryService} from '../../account/user_query_service';
import * as _ from "underscore";
import {DeltaObj} from '../../../../../shared/delta/delta';
import {ContentSegment} from '../../../../../shared/segment';
import {QuillChangeObj} from '../../global/quill/quill_component';
import {SegmentViewerComponent} from '../../global/segment_viewer/segment_viewer_component';
import {QuillDeltaMap} from '../../../../../shared/quill_editor';
import {mapGetters} from 'vuex';

let Delta = Quill.import('delta');

let courseDeltaProperties = {
    title: true,
    description: true,
    timeEstimate: true,
    content: true
};

@Component({
    data: () => {
        return {
            errorMessages: '',
        };
    },
    computed: {
        ...mapGetters(['currentCourse', 'currentCourseLoading'])
    },
    template: require('./edit_course_component.tpl.html')
})
export class EditCourseComponent extends Vue {
    errorMessages: {};
    currentCourseLoading: boolean;
    receivedCourseDelta: DeltaObj;
    currentCourse: CourseEntity;
    userCourseChanges: CourseEntityDeltas;
    contentSegments: { [index: string]: ContentSegment } = {};
    addedContentCounter= 0;

    created() {
        // todo delete me
        // this.loading = true;
        // coursesService.getCurrentCourse().then((course) => {
        //     this.courseVm = _.extend({}, course, {
        //         content: course.content.map((el) => {
        //             return _.extend({}, el, {
        //                 removeCallback: this.getRemoveCallback(el.id),
        //                 onChangeCallback: (change: QuillChangeObj) => this.onChangeCallback(change)
        //             });
        //         })
        //     });
        //
        //     this.courseVm.content.forEach((contentSegment) => {
        //         this.contentSegments[contentSegment.id] = contentSegment;
        //     });
        //
        //     this.loading = false;
        // });
    }

    save() {
        this.currentCourseLoading = true;

        let contentChanges: QuillDeltaMap = (<SegmentViewerComponent> this.$refs.segmentViewer).getContentChanges();
        // let fieldDeltas = <CourseEntityDeltas> diffDeltaObj(this.initialCourseDelta, convertEntityToDeltaObj(this.courseVm));

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
        //     this.$router.push({name: COURSES_ROUTE_NAMES.adminCourseDetails})
        // }).catch((msg) => {
        //     this.errorMessages = msg;
        // })
    }

    timeEstimateUpdated(time) {
        this.currentCourse.timeEstimate = time;
    }

    cancel() {
        this.$router.push({name: COURSES_ROUTE_NAMES.adminCourseDetails})
    }

    editCourseDelta(course: ViewCourseQuillData): DeltaObj {
        return _.extend({}, course, {
            modules: course.modules.map((module) => module.id)
        });
    }

    getRemoveCallback(id: string): () => any {
        return () => {
            let rmIndex = this.currentCourse.content.findIndex((content) => content.id === id);
            this.currentCourse.content.splice(rmIndex, 1);
            delete this.contentSegments[id];
        }
    }

    onChangeCallback(change: QuillChangeObj) {
        let contentSegment = this.contentSegments[change.editorId];
        contentSegment.editorJson = change.oldContents.compose(change.delta);
    }

    addContentCallback() {
        let quillId = 'new-' + this.addedContentCounter++;
        let segment: ContentSegment = {
            id: quillId,
            type: 'CONTENT',
            editorJson: new Delta(),
            removeCallback: this.getRemoveCallback(quillId),
            onChangeCallback: (change: QuillChangeObj) => this.onChangeCallback(change)
    }
        ;
        this.contentSegments[quillId] = segment;
        this.currentCourse.content.push(segment);
    }

    courseUpdate(field: string, val){
        this.userCourseChanges[field] = val;
    }

    /**
     *
     */
    get course() {
        // todo apply user changes
        return this.currentCourse;
    }
}
