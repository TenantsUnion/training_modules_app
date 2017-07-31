import Component from "vue-class-component";
import Vue from "vue";
import {appRouter} from "../router";

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
    // language=HTML
    template: `
        <div id="page-content-wrapper">
            <div class="main">
                <div class="grid-x">
                    <div class="small-12 cell">
                        <div class="callout">
                            <h4>Enrolled in courses
                                <button class="button primary"
                                        @click="enrollInCourse">
                                    Enroll in a Course
                                </button>
                            </h4>
                            <ul v-if="enrolledInCourses.length"
                                class="content-list">
                                <li v-for="course in enrolledInCourses"
                                    class="content-item">
                                    <span>{{ course.name }}</span>
                                    <button class="button primary"
                                            @click="go(course.id)">Go
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="grid-x">
                    <div class="small-12 cell">
                        <div class="small-12 cell">
                            <div class="callout">
                                <h4>Admin Courses
                                    <button class="button primary"
                                            @click="createCourse">Create a
                                        Course
                                    </button>
                                </h4>
                                <ul v-if="adminOfCourses.length"
                                    class="content-list">
                                    <li v-for="course in enrolledInCourses"
                                        class="content-item">
                                        <span>{{ course.name }}</span>
                                        <button class="button primary"
                                                @click="goToCourse(course.id)">
                                            Go
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class LandingPageComponent extends Vue {
    enrolledInCourses: ICourseInfo[];
    adminOfCourses: ICourseInfo[];

    enrollInCourse() {

    }

    createCourse() {
        appRouter.push({name: 'course.create'});
    }

    goToCourse(courseId: string) {

    }


}

export interface ICourseInfo {
    id: string,
    title: string
}