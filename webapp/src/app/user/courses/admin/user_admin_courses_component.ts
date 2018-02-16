import Vue from "vue";
import Component from "vue-class-component";
import {AdminCourseDescription} from "@shared/courses";
import {mapState} from 'vuex';
import {COURSE_ACTIONS} from '../../../courses/store/course/course_actions';
import {ADMIN_COURSE_ROUTES} from "@global/routes";

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
        this.$router.push({
            name: ADMIN_COURSE_ROUTES.editCourse,
            params: {
                courseSlug: course.slug
            }
        });
    }

}