import Vue from "vue";
import Component from "vue-class-component";

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

    }
}