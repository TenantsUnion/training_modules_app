import Vue from "vue"
import Component from "vue-class-component";
import CourseNavigationComponent from '@course/course_navigation_component/course_navigation_component.vue';
import {$} from '../../globals';
import {mapGetters, mapState} from 'vuex';
import {NavigationGuard} from 'vue-router';
import CourseDetailsComponent from "@course/course_details_component/course_details_component";
import {store} from "@webapp_root/app";
import {COURSE_ACTIONS, CourseMode} from "@course/course_store";
import {currentCourseRouteGuard} from "@course/course_route_guards";
import {RootGetters, RootState} from "@webapp_root/store";


@Component({
    computed: {
        ...mapState<RootState>({
            isCourseAdmin: (state, {currentCourseMode}: RootGetters) => currentCourseMode === CourseMode.ADMIN
        }),
        ...mapGetters(['currentCourse', 'currentCourseLoading'])
    },
    beforeRouteEnter: currentCourseRouteGuard,
    beforeRouteUpdate: currentCourseRouteGuard,
    components: {
        'course-navigation': CourseNavigationComponent,
        'course-details': CourseDetailsComponent
    }
})
export default class CourseComponent extends Vue {
    created () {
        $(this.$el).find('#menu-toggle').click(function (e) {
            e.preventDefault();
            $('#page-content-wrapper').toggleClass('toggled');
            $('#sidebar-wrapper').toggleClass('toggled');
            $('.sidebar-nav').toggleClass('toggled');
            $('#wrapper').toggleClass('toggled');
        });
    }
}
