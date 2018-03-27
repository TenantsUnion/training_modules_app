import {loginRoutes} from "@webapp/account/account_routes";
import {availableCoursesRoutes} from "@webapp/available_courses/available_courses_routes";
import {userRoutes} from "@webapp/user/user_routes";
import VueRouter from 'vue-router';

export const appRouter = new VueRouter({});

export const initRouter = () => {
    appRouter.addRoutes([
        loginRoutes,
        userRoutes,
        availableCoursesRoutes
    ]);
};

