import Vue from "vue";
import Component from "vue-class-component";
import {userCoursesHttpService} from "../../user/courses/course_http_service";
import {appRouter} from "../../router";

@Component({
    props: {
        username: String
    },
    data: () => {
        return {
            loading: false,
            errorMessages: '',
            title: '',
            description: '',
            timeEstimate: '',
        };
    },
    template: require('./create_course_component.tpl.html')
})
export class CreateCourseComponent extends Vue {
    errorMessages: {};
    loading: boolean;
    title: string;
    description: string;
    timeEstimate: string;
    username: string;

    create() {
        userCoursesHttpService.createCourse({
            title: this.title,
            description: this.description,
            timeEstimate: this.timeEstimate,
            createdBy: this.username
        }).then(()=>{
            appRouter.push({name: 'adminCourse.courseDetails', params: {courseTitle: this.title}})
        }).catch((msg)=>{
            this.errorMessages = msg;
        })
    }

}
