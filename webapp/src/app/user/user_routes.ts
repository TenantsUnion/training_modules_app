import {RouteConfig} from "vue-router";
import {LandingPageComponent} from "./landing_page_component";
import {CreateCourseComponent} from "../course/create_course_component";

export const userRoutes: RouteConfig[] = [
    {
        path: '/user/:username',
        name: 'user.landing',
        props: true,
        component: LandingPageComponent,
    }, {
        path: '/user/:username/course/create',
        name: 'course.create',
        props: true,
        component: CreateCourseComponent
    }
];
