import Vue from "vue";
import Component from "vue-class-component";
import {CourseNavigationComponent} from '../course_navigation_component/course_navigation_component';
import {$} from '../../globals';
import {coursesService} from '../courses_service';
import {CourseData} from 'courses';
import {CourseDetailsComponent} from "../course_details_component/course_details_component";

@Component({
    data: () => {
        return {
            loading: false,
            course: null,
            isCourseAdmin: false
        };
    },
    template: require('./course_component.tpl.html'),
    components: {
        'course-navigation': CourseNavigationComponent,
        'course-details': CourseDetailsComponent
    }
})
export class CourseComponent extends Vue {
    courseUnsubscribe;
    course: CourseData;
    loading: boolean;
    isCourseAdmin: boolean;

    created() {
        this.loading = true;
        this.isCourseAdmin = coursesService.isCourseAdmin();
        this.courseUnsubscribe = coursesService.subscribeCurrentCourse((course: CourseData) => {
            this.loading = false;
            this.course = course;
        });
    }

    updated() {
        $(this.$el).find('#menu-toggle').click(function (e) {
            e.preventDefault();
            $('#page-content-wrapper').toggleClass('toggled');
            $('#sidebar-wrapper').toggleClass('toggled');
            $('.sidebar-nav').toggleClass('toggled');
            $('#wrapper').toggleClass('toggled');
        });
    }

    destroyed() {
        this.courseUnsubscribe();
    }
}
