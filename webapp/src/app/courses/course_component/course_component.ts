import Vue from "vue";
import Component from "vue-class-component";
import {CourseNavigationComponent} from '../course_navigation_component/course_navigation_component';
import {$} from '../../globals';
import {coursesService} from '../courses_service';
import {CourseData} from 'courses';
import {CourseDetailsComponent} from "../course_details_component/course_details_component";

require('./_course_component.scss');


@Component({
    data: () => {
        return {
            loading: false,
            course: null,
            isAdmin: false
        };
    },
    template: require('./course_component.tpl.html'),
    components: {
        'course-navigation': CourseNavigationComponent,
        'course-details': CourseDetailsComponent
    }
})
export class CourseComponent extends Vue {
    course: CourseData;
    loading: boolean;
    isCourseAdmin: boolean;

    created () {
        this.loading = true;
        this.isCourseAdmin = coursesService.isCourseAdmin();
        coursesService.getCurrentCourse()
            .then((course) => {
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
}
