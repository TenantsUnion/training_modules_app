import Vue from "vue";
import Component from "vue-class-component";
import {userCoursesHttpService} from "../../user/courses/course_http_service";
import {appRouter} from "../../router";
import {coursesService} from '../courses_service';
import {CourseData} from '../../../../../shared/courses';

@Component({
    data: () => {
        return {
            loading: false,
            errorMessages: '',
            course: {}
        };
    },
    template: require('./create_course_component.tpl.html')
})
export class EditCourseComponent extends Vue {
    errorMessages: {};
    loading: boolean;
    course: CourseData;

    created(){
        this.loading = true;
        coursesService.getCurrentCourse()
            .then((course) => {
                this.course = course;
                this.loading = false;
            })
    }

    save() {
        this.loading = true;
        coursesService.saveCourse(this.course).then(()=>{
            appRouter.push({name: 'adminCourse.courseDetails', params: {courseTitle: this.title}})
        }).catch((msg)=>{
            this.errorMessages = msg;
        })
    }

}
