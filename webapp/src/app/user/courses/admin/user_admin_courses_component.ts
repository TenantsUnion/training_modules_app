import Vue from "vue";
import Component from "vue-class-component";
import {AdminCourseDescription} from "courses.ts";
import {mapState} from 'vuex';


@Component({
    template: require('./user_admin_courses_component.tpl.html'),
    computed: mapState({
        courses: ({userCourses}) => userCourses.adminCourseDescriptions,
        loading: ({userCourses}) => userCourses.loading
    })
})
export class UserAdminCourseComponent extends Vue {
    createCourse () {
        this.$router.push('course/create')
    }

    go (course: AdminCourseDescription) {
        this.$router.push(`admin-course/${course.slug}`);
    }

}