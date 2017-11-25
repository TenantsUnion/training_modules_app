import Vue from "vue";
import Component from "vue-class-component";
import {CreateCourseEntityPayload} from 'courses';
import {COURSES_ROUTE_NAMES} from '../courses_routes';
import {SegmentViewerComponent} from '../../global/segment_viewer/segment_viewer_component';
import {FormState} from '../../vue-form';
import {Segment} from 'segment';
import {COURSE_ACTIONS, CourseActionTree} from '../store/course/course_actions';

@Component({
    props: {
        username: String
    },
    data: () => {
        return {
            loading: false,
            errorMessages: null,
            course: <CreateCourseEntityPayload> {
                active: true,
                openEnrollment: true,
                title: '',
                description: '',
                timeEstimate: '',
                createdBy: '',
                orderedContentQuestions: []
            },
            formstate: {},
            quillContent: []
        };
    },
    template: require('./create_course_component.tpl.html')
})
export class CreateCourseComponent extends Vue {
    errorMessages: {};
    loading: boolean;
    course: CreateCourseEntityPayload;
    quillContent: Segment[] = [];
    contentCounter = 0;
    username: string;
    formstate: FormState;

    async createCourse() {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }
        this.loading = true;
        this.errorMessages = null;
        let createCoursePayload: CreateCourseEntityPayload = {
            title: this.course.title,
            timeEstimate: this.course.timeEstimate,
            active: this.course.active,
            openEnrollment: this.course.openEnrollment,
            orderedContentQuestions: (<SegmentViewerComponent> this.$refs.segmentViewer).getContents(),
            description: this.course.description
        };
        try {
            await this.$store.dispatch(COURSE_ACTIONS.CREATE_COURSE, createCoursePayload);
        } catch (msg) {
            this.errorMessages = msg;
        } finally {
            this.loading = false
        }
    }

    timeUpdated(time: string) {
        this.course.timeEstimate = time;
    }

    addContentCallback() {
        let quillId = '' + this.contentCounter++; // place holder id to identify until server assigns unique id from database
        this.quillContent.push({
            id: quillId,
            type: 'CONTENT',
            removeCallback: () => {
                let rmIndex = this.quillContent.findIndex((el) => el.id === quillId);
                this.quillContent.splice(rmIndex, 1);
            }
        });
    }
}
