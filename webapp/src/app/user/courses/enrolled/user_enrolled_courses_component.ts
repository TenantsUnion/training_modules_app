import Vue from "vue";
import Component from "vue-class-component";
import {USER_ROUTES} from "@global/routes";

@Component({
    data: () => {
        return {
            loading: false,
            courses: []
        };
    },
})
export default class UserEnrolledCoursesComponent extends Vue {

    go (courseId: string) {

    }

    enrollInCourse () {
        this.$router.push({
            name: USER_ROUTES.availableCourses
        });
    }
}