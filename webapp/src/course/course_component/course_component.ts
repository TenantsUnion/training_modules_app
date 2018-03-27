import Vue from "vue"
import Component from "vue-class-component";
import CourseNavigationComponent from '@webapp/course/course_navigation_component/course_navigation_component.vue';
import {mapGetters, mapState} from 'vuex';
import CourseDetailsComponent from "@webapp/course/course_details_component/course_details_component";
import {CourseMode} from "@webapp/course/course_store";
import {CourseStructureRouteGuardMixin} from "@webapp/course/course_route_guards";
import {RootGetters, RootState} from "@store/store_types";


@Component({
    computed: {
        ...mapState<RootState>({
            isCourseAdmin: (state, {currentCourseMode}: RootGetters) => currentCourseMode === CourseMode.ADMIN
        }),
        ...mapGetters(['currentCourse', 'currentCourseLoading'])
    },
    mixins: [CourseStructureRouteGuardMixin],
    components: {
        'course-navigation': CourseNavigationComponent,
        'course-details': CourseDetailsComponent
    }
})
export default class CourseComponent extends Vue {
    created () {
        this.$(this.$el).find('#menu-toggle').on('click', (e) => {
            e.preventDefault();
            this.$('#page-content-wrapper').toggleClass('toggled');
            this.$('#sidebar-wrapper').toggleClass('toggled');
            this.$('.sidebar-nav').toggleClass('toggled');
            this.$('#wrapper').toggleClass('toggled');
        });
    }
}
