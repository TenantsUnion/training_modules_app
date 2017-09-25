import Vue from "vue";
import Component from "vue-class-component";
import {appRouter} from "../../router";
import {coursesService} from '../courses_service';
import {CourseData} from '../../../../../shared/courses';
import {COURSES_ROUTE_NAMES} from '../courses_routes';

@Component({
    data: () => {
        return {
            loading: false,
            errorMessages: '',
            course: {}
        };
    },
    template: require('./edit_course_component.tpl.html')
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
            appRouter.push({name: COURSES_ROUTE_NAMES.adminCourseDetails})
        }).catch((msg)=>{
            this.errorMessages = msg;
        })
    }

    cancel() {
        this.$router.push({name: COURSES_ROUTE_NAMES.adminCourseDetails})
    }

}
