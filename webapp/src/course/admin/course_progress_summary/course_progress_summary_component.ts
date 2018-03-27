import Vue from 'vue';
import Component from "vue-class-component";
import {CourseStructureRouteGuardMixin} from "@webapp/course/course_route_guards";
import {mapState} from "vuex";
import {RootGetters, RootState} from "@store/store_types";
import {COURSE_PROGRESS_SUMMARY_ACTIONS} from "@webapp/course/admin/course_progress_summary/course_progress_summary_store";

@Component({
    mixins: [CourseStructureRouteGuardMixin],
    computed: mapState({
        course: (state: RootState, {currentCourse}: RootGetters) => currentCourse,
        progressSummary: (state, {currentCourseProgressSummary}: RootGetters) => currentCourseProgressSummary,
        summaryLoading: (state, {currentCourseProgressSummaryLoading: loading}: RootGetters) => loading
    })
})
export class CourseEnrolledUsersComponent extends Vue {
    created () {
        this.$store.dispatch(COURSE_PROGRESS_SUMMARY_ACTIONS.LOAD_COURSE_PROGRESS_SUMMARY, this.$store.state.course.currentCourseId);
    }
}

export default CourseEnrolledUsersComponent;