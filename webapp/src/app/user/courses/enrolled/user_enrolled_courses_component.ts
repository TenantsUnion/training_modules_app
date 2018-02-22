import Vue from "vue";
import Component from "vue-class-component";
import {ENROLLED_COURSE_ROUTES, USER_ROUTES} from "@global/routes";
import {mapState} from "vuex";

@Component({
    computed: mapState({
        courses: ({userCourses}) => userCourses.enrolledCourseDescriptions,
        loading: ({userCourses}, {currentCourseLoading}) => userCourses.loading || currentCourseLoading
    })
})
export default class UserEnrolledCoursesComponent extends Vue {

    go (courseSlug: string) {
        this.$router.push({
            name: ENROLLED_COURSE_ROUTES.enrolledCourse,
            params: {courseSlug}
        });
    }

    enrollInCourse () {
        this.$router.push({
           name: USER_ROUTES.availableCourses
        });
    }
}