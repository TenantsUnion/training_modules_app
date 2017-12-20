import Vue from "vue";
import Component from "vue-class-component";
import {CreateCourseEntityPayload} from 'courses';
import {SegmentViewerComponent} from '../../global/segment_viewer/segment_viewer_component';
import {FormState} from '../../vue-form';
import {Segment} from 'segment';
import {COURSE_ACTIONS} from '../store/course/course_actions';
import {appRouter} from '../../router';
import {COURSES_ROUTE_NAMES} from '../courses_routes';

@Component({
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
            appRouter.push({
                name: COURSES_ROUTE_NAMES.adminCourseDetails,
                params: {
                    courseSlug: this.$store.getters.getSlugFromCourseId(this.$store.state.course.currentCourseId)
                }
            });

        } catch (msg) {
            this.errorMessages = msg;
        } finally {
            this.loading = false
        }
    }

    timeUpdated(time: string) {
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
