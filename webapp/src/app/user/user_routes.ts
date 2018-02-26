import CreateCourseComponent from "./create/create_course_component.vue";
import {NavigationGuard, RouteConfig} from "vue-router";
import CreateContentComponent from "./content/create_content/create_content_component.vue";
import ContentDescriptionListComponent from "./content/content_description_list/content_description_list_component.vue";
import EditUserContentComponent from "./content/edit/edit_user_content_component.vue";
import {store} from '../state_store';
import {USER_ACTIONS} from './store/user_store';
import {appRouter} from '../router';
import {LOGIN_ROUTE} from '../account/account_routes';
import AvailableCoursesComponent from "../available_courses/available_courses_component.vue";
import UserEnrolledCoursesComponent from "./courses/enrolled/user_enrolled_courses_component.vue";
import UserAdminCourseComponent from "./courses/admin/user_admin_courses_component.vue";
import {USER_ROUTES} from "@global/routes";
import {AdminCourseRoutes, EnrolledCourseRoutes, PreviewCourseRoutes} from "@course/courses_routes";

/**
 * If vue route matches username param then check if user is logged or redirect to login page
 */
const userInfoRefresh: NavigationGuard = async (to, from, next) => {
    let username = to.params.username;
    if (username) {
        await store.dispatch(USER_ACTIONS.LOAD_INFO_FROM_USER_SESSION, username);
        if (!store.state.user.loggedIn) {
            appRouter.push({path: LOGIN_ROUTE});
        } else {
            next();
        }
    } else {
        next();
    }
};

export const userRoutes: RouteConfig = {
    path: '/user/:username',
    name: 'user',
    props: true,
    children: [{
        path: 'enrolled-courses',
        name: USER_ROUTES.enrolledCourses,
        props: true,
        component: UserEnrolledCoursesComponent
    }, {
        path: 'admin-courses',
        name: USER_ROUTES.adminCourses,
        props: true,
        component: UserAdminCourseComponent
    }, {
        path: 'enroll/available-courses',
        name: USER_ROUTES.availableCourses,
        component: AvailableCoursesComponent
    }, {
        path: 'course/create',
        name: 'create',
        props: true,
        component: CreateCourseComponent
    }, {
        path: 'content',
        name: 'content',
        props: true,
        component: ContentDescriptionListComponent
    }, {
        path: 'content/create',
        name: 'content.create',
        props: true,
        component: CreateContentComponent
    }, {
        path: 'content/:contentId/edit',
        name: 'content.edit',
        props: true,
        component: EditUserContentComponent
    }],
    component: {
        props: ['username'],
        beforeRouteEnter: userInfoRefresh,
        beforeRouteUpdate: userInfoRefresh,
        // language=HTML
        template: `
            <div>
                <app-header :username="username"></app-header>
                <status-message></status-message>
                <router-view></router-view>
            </div>
        `
    }
};

userRoutes.children = userRoutes.children.concat([AdminCourseRoutes, EnrolledCourseRoutes, PreviewCourseRoutes]);

