import Vue from "vue";
import Component from "vue-class-component";
import {AdminCourseDescription} from "courses";
import {userCoursesHttpService} from "../course_http_service";
import * as VueRouter from "vue-router";

@Component({
    data: () => {
        return {
            courses: [],
            loading: false
        };
    },
    template: require('./user_admin_courses_component.tpl.html')
})
export class UserAdminCourseComponent extends Vue {
    errorMessages: object;
    $router: VueRouter
    loading: boolean;
    courses: AdminCourseDescription[];

    created () {
        this.fetchAdminCourseDescriptionsList();
    }

    fetchAdminCourseDescriptionsList (){
        this.loading = true;
        userCoursesHttpService.getUserAdminCourses()
            .then((courseDescriptions) => {
                this.courses = courseDescriptions;
                this.loading = false;
            })
            .catch((errorMessages) => {
                this.errorMessages = errorMessages;
                this.loading = false;
            });
    }

    createCourse () {
        this.$router.push('course/create')
    }

}