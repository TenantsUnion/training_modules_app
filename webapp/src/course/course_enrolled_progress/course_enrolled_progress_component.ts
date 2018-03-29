import Vue from "vue";
import Component from "vue-class-component";
import CourseProgressSummaryComponent
    from "@course/course_enrolled_progress/course_progress_summary/course_progress_summary_component.vue";
import CourseEnrolledTableComponent
    from "@course/course_enrolled_progress/course_enrolled_table/course_enrolled_table_component.vue";


@Component({
    components: {
        'course-progress-summary': CourseProgressSummaryComponent,
        'course-enrolled-table': CourseEnrolledTableComponent
    }
})
export class CourseEnrolledProgressComponent extends Vue {
}

export default CourseEnrolledProgressComponent;