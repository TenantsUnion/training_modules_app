import Vue from "vue";
import Component from "vue-class-component";
import {CourseDescription} from "@shared/courses";
import {mapState} from 'vuex';
import {ADMIN_COURSE_ROUTES} from "@global/routes";
import {RootGetters, RootState} from "@webapp_root/store";

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

    async go(course: CourseDescription) {
        this.$router.push({
            name: ADMIN_COURSE_ROUTES.editCourse,
            params: {
                courseSlug: course.slug
            }
        });
    }

}