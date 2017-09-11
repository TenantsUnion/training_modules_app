import {ModuleDetails} from "modules";
import axios from "axios";
import {CourseData} from 'courses';
import VueRouter from "vue-router";
import {appRouter} from "../router";

export class CoursesService {
    currentCourse: CourseData;
    router: VueRouter;

    constructor (router: VueRouter) {
        this.router = router;
    }

    getCourseDetails (courseId: string): Promise<ModuleDetails[]> {
        return axios.get(`courses/details/${courseId}`)
            .then((response) => {
                return <ModuleDetails[]> response.data;
            }).catch((response) => {
                throw response.data.data;
            })
    }

    loadAdminCourse (username: string, courseTitle: string): Promise<CourseData> {
        return axios.get(`user/${username}/courses/admin/${courseTitle}`)
            .then((response) => {
                return <CourseData> response.data;
            }).catch((response) => {
                throw response.data.data;
            });
    }

    loadEnrolledCourse (username: string, courseTitle: string): Promise<CourseData> {
        return null
    }

    getCurrentCourse (): Promise<CourseData> {
        // use route to check if admin/ load appropriate course

        let username = this.router.currentRoute.params.username;
        let courseTitle = this.router.currentRoute.params.courseTitle;

        if (this.currentCourse && this.currentCourse.title === this.currentCourse.title) {
            return Promise.resolve(this.currentCourse);
        }

        let course = this.isCourseAdmin() ?
            this.loadAdminCourse(username, courseTitle) :
            this.loadEnrolledCourse(username, courseTitle);

        course.then((currentCourse) => {
            this.currentCourse = currentCourse;
            return currentCourse;
        });

        return course;
    }

    isCourseAdmin (): boolean {
        return this.router.currentRoute.matched.some((matchedRoute) => {
            return matchedRoute.name === 'adminCourse';
        });
    }
}

export const coursesService = new CoursesService(appRouter);