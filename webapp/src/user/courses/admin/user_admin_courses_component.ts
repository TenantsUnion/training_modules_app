import Vue from "vue";
import Component from "vue-class-component";
import {CourseDescription} from "@shared/courses";
import {mapState} from 'vuex';
import {ADMIN_COURSE_ROUTES, TRAINING_ROUTES} from "@webapp/global/routes";
import {RootGetters, RootState} from "@store/store_types";
import {Location} from 'vue-router';

@Component({
    computed: mapState({
        courses: ({coursesListing: {adminCourseDescriptions}}: RootState) => adminCourseDescriptions,
        loading: ({coursesListing: {loading}}: RootState, {currentCourseLoading}: RootGetters) => loading || currentCourseLoading
    })
})
export default class UserAdminCourseComponent extends Vue {
    createCourse() {
        this.$router.push('course/create')
    }

    async enrolledUsers(course: CourseDescription) {
        this.$router.push({
            name: ADMIN_COURSE_ROUTES.enrolledUsers,
            params: {
                courseSlug: course.slug
            }
        })
    }

    courseLocation(course: CourseDescription): Location {
        return {
            name: TRAINING_ROUTES.course,
            params: {
                courseSlug: course.slug
            }
        };
    }

}