import Vue from "vue";
import Component from "vue-class-component";
import CourseProgressSummaryComponent
    from "@course/course_enrolled/course_enrolled_summary/course_enrolled_summary_component.vue";
import CourseEnrolledTableComponent
    from "@course/course_enrolled/course_enrolled_table/course_enrolled_table_component.vue";
import {CourseStructureRouteGuardMixin} from '@course/course_route_guards';
import {mapState} from 'vuex';
import {RootGetters} from '@store/store_types';

@Component({
    /**
     * Route guards must be on component that is passed to route configuration
     */
    mixins: [CourseStructureRouteGuardMixin],
    components: {
        'course-progress-summary': CourseProgressSummaryComponent,
        'course-enrolled-table': CourseEnrolledTableComponent
    },
    computed: mapState({
        course: (state, {currentCourse}: RootGetters) => currentCourse
    })
})
export class CourseEnrolledPageComponent extends Vue {
}

export default CourseEnrolledPageComponent;