import {RouteConfig} from "vue-router";
import AvailableCoursesComponent from "./available_courses_component.vue";

export enum AVAILABLE_COURSES_ROUTES {
    AVAILABLE_COURSES_LIST = 'AVAILABLE_COURSES_LIST',
}

export const availableCoursesRoutes: RouteConfig = {
    path: 'available-courses',
    name: AVAILABLE_COURSES_ROUTES.AVAILABLE_COURSES_LIST,
    component: AvailableCoursesComponent
};
