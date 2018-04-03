import Vue from 'vue';
import Component from "vue-class-component";
import {mapState} from "vuex";
import {RootGetters, RootState} from "@store/store_types";
import {COURSE_PROGRESS_SUMMARY_ACTIONS} from '@course/course_enrolled/course_enrolled_summary/course_enrolled_summary_store';

@Component({
    computed: mapState({
        course: (state: RootState, {currentCourse}: RootGetters) => currentCourse,
        totalCompleted: (state, {currentCourseProgressSummary: summary}: RootGetters) => summary && summary.totalCompleted,
        totalEnrolled: (state, {currentCourseProgressSummary: summary}: RootGetters) => summary && summary.totalEnrolled,
        loading: (state, {currentCourseProgressSummaryLoading: loading}: RootGetters) => loading
    })
})
export class CourseProgressSummaryComponent extends Vue {
    created() {
        this.$store.dispatch(COURSE_PROGRESS_SUMMARY_ACTIONS.LOAD_COURSE_PROGRESS_SUMMARY, this.$store.state.course.currentCourseId);
    }
}

export default CourseProgressSummaryComponent;