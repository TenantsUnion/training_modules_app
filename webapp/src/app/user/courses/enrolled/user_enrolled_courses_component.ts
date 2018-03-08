import Vue from "vue";
import Component from "vue-class-component";
import {ENROLLED_COURSE_ROUTES, USER_ROUTES} from "@global/routes";
import {mapState} from "vuex";
import {RootGetters, RootState} from "@webapp_root/store";

@Component({
    computed: mapState({
        courses: ({coursesListing}: RootState) => coursesListing.enrolledCourseDescriptions,
        loading: ({coursesListing}: RootState, {currentCourseLoading}: RootGetters) =>
            coursesListing.loading || currentCourseLoading
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