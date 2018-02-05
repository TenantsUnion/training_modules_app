import Vue from "vue";
import Component from "vue-class-component";
import {AdminCourseDescription} from "../../../../shared/courses";
import {COURSES_ROUTE_NAMES} from '../courses/courses_routes';
import {COURSE_ACTIONS} from '../courses/store/course/course_actions';


@Component({})
export default class AvailableCoursesComponent extends Vue {
    view () {
        this.$router.push('')
        // dispatch vuex state action
    }

    enroll () {
        this.$router.push('')
        // dispatch vuex state action
    }

    async go (course: AdminCourseDescription) {
        // todo -- loading indicator
        await this.$store.dispatch(COURSE_ACTIONS.SET_CURRENT_COURSE, {id: course.id, isAdmin: true});
        this.$router.push({
            name: COURSES_ROUTE_NAMES.adminCourseDetails,
            params: {
                courseSlug: course.slug
            }
        });
    }

}
