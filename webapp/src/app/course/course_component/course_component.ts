import Vue from "vue"
import Component from "vue-class-component";
import CourseNavigationComponent from '@course/course_navigation_component/course_navigation_component.vue';
import {$} from '../../globals';
import {mapGetters, mapState} from 'vuex';
import {COURSE_ACTIONS} from '@course/store/course_actions';
import {NavigationGuard} from 'vue-router';
import CourseDetailsComponent from "@course/course_details_component/course_details_component";
import {CourseMode} from "@course/store/course_mutations";
import {store} from "@webapp_root/app";

const currentCourseRouteGuard: NavigationGuard = async (to: any, from: any, next) => {
    let slug = to.params.courseSlug;
    if (!slug || slug === 'undefined') {
        throw new Error('Invalid route. :courseSlug must be defined');
    }
    try {
        await store.dispatch(COURSE_ACTIONS.SET_CURRENT_COURSE_FROM_SLUG, slug);
    } catch (e) {
        console.error(`Error setting current course. ${e}`);
    } finally {
        next();
    }

};

@Component({
    computed: {
        ...mapState({
            isCourseAdmin: ({course}) => course.mode === CourseMode.ADMIN
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
