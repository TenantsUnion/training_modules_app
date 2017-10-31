import Vue from "vue";
import Component from "vue-class-component";
import {userCoursesHttpService} from "../../user/courses/course_http_service";
import {CreateCourseData} from '../../../../../shared/courses';
import {COURSES_ROUTE_NAMES} from '../courses_routes';
import {QuillComponent} from '../../quill/quill_component';

@Component({
    props: {
        username: String
    },
    data: () => {
        return {
            loading: false,
            errorMessages: null,
            course: {
                active: true,
                title: '',
                description: '',
                timeEstimate: '',
                createdBy: ''
            }
        };
    },
    template: require('./create_course_component.tpl.html')
})
export class CreateCourseComponent extends Vue {
    errorMessages: {};
    loading: boolean;
    course: CreateCourseData;
    username: string;

    async create() {
        this.errorMessages = {};
        this.loading = true;

        try {
            await userCoursesHttpService.createCourse({
                title: this.course.title,
                timeEstimate: this.course.timeEstimate,
                active: this.course.active,
                createdBy: this.username,
                content: (<QuillComponent> this.$refs.editor).getQuillEditorContents(),
                description: this.course.description
            });

            // todo validation
            this.$router.push({
                name: COURSES_ROUTE_NAMES.adminCourseDetails,
                params: {
                    courseTitle: this.course.title
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
}
