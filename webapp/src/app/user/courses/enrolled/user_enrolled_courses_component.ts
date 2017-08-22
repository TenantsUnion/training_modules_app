import Vue from "vue";
import Component from "vue-class-component";

@Component({
    data: () => {
        return {
            loading: false,
            courses: []
        };
    },
    template: require('./user_enrolled_courses_component.tpl.html')
})
export class UserEnrolledCoursesComponent extends Vue {

    go (courseId: string) {

    }

    enrollInCourse () {

    }
}