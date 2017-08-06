import Component from "vue-class-component";
import Vue from "vue";
import {appRouter} from "../../router";

@Component({
    data: () => {
        return {
            enrolledInCourses: [],
            adminOfCourses: []
        };
    },
    props: {
        username: String
    },
    template: require('./users_courses_component.tpl.html')
})
export class UserCoursesComponent extends Vue {
    enrolledInCourses: ICourseInfo[];
    adminOfCourses: ICourseInfo[];

    enrollInCourse() {

    }

    createCourse() {
        appRouter.push('course/create');
    }

    goToCourse(courseId: string) {
        appRouter.push(`course/courseId`);
    }


}

export interface ICourseInfo {
    id: string,
    title: string
}