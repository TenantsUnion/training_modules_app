import {store} from "@store/store";
import Vue from "vue";
import Component from "vue-class-component";
import {CourseDescription} from "@shared/courses";
import {NavigationGuard} from "vue-router";
import {AVAILABLE_COURSES_ACTIONS} from "./available_courses_store";
import {mapState} from "vuex";
import {ENROLLED_COURSE_ROUTES, PREVIEW_COURSE_ROUTES} from "@webapp/global/routes";
import {USER_ACTIONS} from "@webapp/user/store/user_store";
import {RootState} from "@store/store_types";

export const availableCoursesRouteGuard: NavigationGuard = async function (to, from, next) {
    try {
        store.dispatch(AVAILABLE_COURSES_ACTIONS.LOAD_AVAILABLE_COURSES);
    } catch (e) {
        console.error(`Error setting current course. ${e}`);
    } finally {
        next();
    }
};
@Component({
    computed: {
        ...mapState<RootState>({
            loading: ({availableCourses}) => availableCourses.loading,
            courses: ({availableCourses}) => availableCourses.courses,
            enrolling: ({user}) => user.loggedIn
        })
    },
    beforeRouteEnter: availableCoursesRouteGuard,
    beforeRouteUpdate: availableCoursesRouteGuard
})
export default class AvailableCoursesComponent extends Vue {
    async preview (course: CourseDescription) {
        this.$router.push({
            name: PREVIEW_COURSE_ROUTES.coursePreview,
            params: {
                courseSlug: course.slug
            }
        });
    }

    async enroll (course: CourseDescription) {
        await this.$store.dispatch(USER_ACTIONS.ENROLL_IN_COURSE, course.id);
        this.$router.push({
            name: ENROLLED_COURSE_ROUTES.enrolledCourse,
            params: {
                courseSlug: this.$store.getters.getSlugFromCourseId(course.id)
            }
        });
    }
}
