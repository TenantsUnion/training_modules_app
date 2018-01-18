import Vue from "vue";
import Component from "vue-class-component";
import {CourseNavigationComponent} from '../course_navigation_component/course_navigation_component';
import {$} from '../../globals';
import {CourseDetailsComponent} from "../course_details_component/course_details_component";
import {mapGetters, mapState} from 'vuex';
import {COURSE_ACTIONS} from '../store/course/course_actions';
import {NavigationGuard} from 'vue-router';
import {store} from '../../state_store';

const currentCourseRouteGuard: NavigationGuard = async (to, from, next) => {
    let slug = to.params.courseSlug;
    if (!slug || slug === 'undefined') {
        throw new Error('Invalid route. :courseSlug must be defined');
    }
    try {
        await store.dispatch(COURSE_ACTIONS.SET_CURRENT_COURSE_FROM_SLUG, {slug, isAdmin: true});
    } catch (e) {
        console.error(`Error setting current course. ${e}`);
    } finally {
        next();
    }

};

@Component({
    template: require('./course_component.tpl.html'),
    computed: {
        ...mapState({
           isCourseAdmin: ({course}) => course.isAdmin
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
export class CourseComponent extends Vue {
    created() {
        $(this.$el).find('#menu-toggle').click(function (e) {
            e.preventDefault();
            $('#page-content-wrapper').toggleClass('toggled');
            $('#sidebar-wrapper').toggleClass('toggled');
            $('.sidebar-nav').toggleClass('toggled');
            $('#wrapper').toggleClass('toggled');
        });
    }
}
