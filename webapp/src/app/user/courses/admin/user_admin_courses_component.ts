import Vue from "vue";
import Component from "vue-class-component";
import {AdminCourseDescription} from "@shared/courses";
import {mapState} from 'vuex';
import {COURSES_ROUTE_NAMES} from '../../../courses/courses_routes';
import {COURSE_ACTIONS} from '../../../courses/store/course/course_actions';

@Component({
    computed: mapState({
        courses: ({userCourses}) => userCourses.adminCourseDescriptions,
        loading: ({userCourses}, {currentCourseLoading}) => userCourses.loading || currentCourseLoading
    })
})
export default class UserAdminCourseComponent extends Vue {
    createCourse() {
        this.$router.push('course/create')
    }

    async go(course: AdminCourseDescription) {
        const mode = this.$store.getters.getCourseModeFromId(course.id);
        await this.$store.dispatch(COURSE_ACTIONS.SET_CURRENT_COURSE, {id: course.id, mode});
        this.$router.push({
            name: COURSES_ROUTE_NAMES.adminCourseDetails,
            params: {
                courseSlug: course.slug
            }
        });
    }

}