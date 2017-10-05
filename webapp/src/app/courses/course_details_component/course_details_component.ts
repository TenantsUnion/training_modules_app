import Vue from 'vue';
import Component from "vue-class-component";
import {ViewCourseQuillData} from '../../../../../shared/courses';
import {coursesService} from '../courses_service';

@Component({
    data: () => {
        return {
            course: null
        };
    },
    template: require('./course_details_component.tpl.html')
})

export class CourseDetailsComponent extends Vue {
    courseUnsubscribe: () => any;
    loading: boolean;
    course: ViewCourseQuillData;

    created() {
        this.loading = true;
        this.courseUnsubscribe = coursesService.subscribeCurrentCourse((course) => {
            this.loading = false;
            this.course = course;
        });
    }

    destroyed() {
        this.courseUnsubscribe();
    }

}