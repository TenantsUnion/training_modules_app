import Vue from 'vue';
import Component from "vue-class-component";
import {CourseEntity} from '../../../../../shared/courses';
import {mapGetters} from 'vuex';

@Component({
    computed: {
        ...mapGetters(['currentCourse', 'currentCourseLoading'])
    },
    template: require('./course_details_component.tpl.html')
})
export class CourseDetailsComponent extends Vue {
    // courseUnsubscribe: () => any;
    currentCourseLoading: boolean;
    currentCourse: CourseEntity;

    mounted() {
        // todo delete me
        // this.currentCourseLoading = true;
        // this.courseUnsubscribe = coursesService.subscribeCurrentCourse((course) => {
        //     this.currentCourseLoading = false;
        //     this.currentCourse = course;
        // });
    }

    destroyed() {
        // this.courseUnsubscribe();
    }
}