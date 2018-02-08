import Vue from "vue";
import Component from "vue-class-component";
import {CourseDescription} from "@shared/courses";
import {COURSE_ACTIONS} from '../courses/store/course/course_actions';
import {CourseMode} from "../courses/store/course/course_mutations";
import {NavigationGuard} from "vue-router";
import {store} from "../state_store";
import {AVAILABLE_COURSES_ACTIONS} from "./available_courses_store";
import {mapState} from "vuex";
import {PREVIEW_COURSE_ROUTES} from "@global/routes";

export const availableCoursesRouteGuard: NavigationGuard = async (to, from, next) => {
    try {
        await store.dispatch(AVAILABLE_COURSES_ACTIONS.LOAD_AVAILABLE_COURSES);
    } catch (e) {
        console.error(`Error setting current course. ${e}`);
    } finally {
        next();
    }
};
@Component({
    computed: {
        ...mapState({
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
        await this.$store.dispatch(COURSE_ACTIONS.SET_CURRENT_COURSE, {id: course.id, mode: CourseMode.PREVIEW});
        this.$router.push({
            name: PREVIEW_COURSE_ROUTES.coursePreview,
            params: {
                courseSlug: course.slug
            }
        });
    }

    async enroll (course: CourseDescription) {
        await this.$store.dispatch(COURSE_ACTIONS.ENROLL_IN_COURSE, course.id);
        this.$router.push('')
        // dispatch vuex state action
    }
}