import Vue from "vue";
import Component from "vue-class-component";
import {userCoursesHttpService} from "../../user/courses/course_http_service";
import {appRouter} from "../../router";
import {CreateCourseData} from '../../../../../shared/courses';
import {COURSES_ROUTE_NAMES} from '../courses_routes';

@Component({
    props: {
        username: String
    },
    data: () => {
        return {
            loading: false,
            errorMessages: '',
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

    create() {
        this.course.createdBy = this.username;
        this.loading = true;
        userCoursesHttpService.createCourse(this.course).then(() => {
            this.loading = false;
            appRouter.push({name: COURSES_ROUTE_NAMES.adminCourseDetails, params: {courseTitle: this.course.title}})
        }).catch((msg) => {
            this.loading = false;
            this.errorMessages = msg;
        })
    }

    timeUpdated(time: number) {
        this.course.timeEstimate = time + '';
    }

}
