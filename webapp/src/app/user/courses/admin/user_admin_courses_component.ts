import Vue from "vue";
import Component from "vue-class-component";
import {AdminCourseDescription} from "courses.ts";
import {mapState} from 'vuex';
import {COURSES_ROUTE_NAMES} from '../../../courses/courses_routes';
import {COURSE_ACTIONS} from '../../../courses/store/course/course_actions';


@Component({
    template: require('./user_admin_courses_component.tpl.html'),
    computed: mapState({
        courses: ({userCourses}) => userCourses.adminCourseDescriptions,
        loading: ({userCourses}) => userCourses.loading
    })
})
export class UserAdminCourseComponent extends Vue {
    createCourse() {
        this.$router.push('course/create')
    }

    async go(course: AdminCourseDescription) {
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