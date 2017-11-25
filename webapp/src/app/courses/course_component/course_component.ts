import Vue from "vue";
import Component from "vue-class-component";
import {CourseNavigationComponent} from '../course_navigation_component/course_navigation_component';
import {$} from '../../globals';
import {coursesService} from '../courses_service';
import {CourseEntity, ViewCourseQuillData} from 'courses.ts';
import {CourseDetailsComponent} from "../course_details_component/course_details_component";
import {coursesRoutesService} from '../courses_routes';
import {mapGetters, Store} from 'vuex';
import {RootState} from '../../state_store';

@Component({
    template: require('./course_component.tpl.html'),
    computed: {
        ...mapGetters(['currentCourse', 'currentCourseLoading'])
    },
    components: {
        'course-navigation': CourseNavigationComponent,
        'course-details': CourseDetailsComponent
    }
})
export class CourseComponent extends Vue {
    courseUnsubscribe;
    currentCourse: CourseEntity;
    currentCourseLoading: boolean;
    addedNavigationCollapse: boolean = false;

    created() {
        // this.isCourseAdmin = coursesRoutesService.isCourseAdmin();
        // todo delete
        // this.courseUnsubscribe = coursesService.subscribeCurrentCourse((course: ViewCourseQuillData) => {
        //     this.loading = false;
        //     this.course = course;
        // });

    }

    updated() {
        // fixme vue lifecycle hook that is only when child elements first created?
        if (!this.addedNavigationCollapse) {
            $(this.$el).find('#menu-toggle').click(function (e) {
                e.preventDefault();
                $('#page-content-wrapper').toggleClass('toggled');
                $('#sidebar-wrapper').toggleClass('toggled');
                $('.sidebar-nav').toggleClass('toggled');
                $('#wrapper').toggleClass('toggled');
            });
            this.addedNavigationCollapse = true;
        }
    }

    destroyed() {
        this.courseUnsubscribe();
    }

    get isCourseAdmin():boolean {
        return this.$store.state.course.getters.isCourseAdmin;
    }
}
