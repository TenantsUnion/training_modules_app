import {NavigationGuard, RouteConfig} from "vue-router";
import CourseComponent from './course_component/course_component.vue';
import {ENROLLED_COURSE_ROUTES, PREVIEW_COURSE_ROUTES} from "@global/routes";
import ModuleDetailsComponent from "@module/module_details_component/module_details_component.vue";
import ViewSectionComponent from "@section/view/view_section_component.vue";
import CourseDetailsComponent from "./course_details_component/course_details_component.vue";
import {appRouter} from "../router";
import {USER_PROGRESS_ACTIONS} from "@user_progress/user_progress_store";
import {LOGIN_ROUTE} from "../account/account_routes";
import {appGetters, store} from "@webapp_root/app";



const refreshProgress: NavigationGuard = async (to, from, next) => {
    if (!store.state.user.loggedIn) {
        appRouter.push({path: LOGIN_ROUTE});
        return;
    }
    let courseSlug = to.params.courseSlug;
    if (courseSlug) {
        console.log(store);
        await store.dispatch(USER_PROGRESS_ACTIONS.LOAD_USER_PROGRESS, appGetters.getCourseIdFromSlug(courseSlug));
    }
    next();
};
export const EnrolledCourseRoutes: RouteConfig = {
    path: 'learning/course',
    props: true,
    component: CourseComponent,
    beforeEnter: refreshProgress,
    children: [
        {
            path: ':courseSlug',
            name: ENROLLED_COURSE_ROUTES.enrolledCourse,
            component: CourseDetailsComponent
        }, {
            path: ':courseSlug/module/:moduleSlug',
            name: ENROLLED_COURSE_ROUTES.enrolledModule,
            component: ModuleDetailsComponent
        }, {
            path: ':courseSlug/module/:moduleSlug/section/:sectionSlug',
            name: ENROLLED_COURSE_ROUTES.enrolledSection,
            component: ViewSectionComponent
        }
    ]
};

export const PreviewCourseRoutes: RouteConfig = {
    path: 'preview/course',
    props: true,
    component: CourseComponent,
    children: [
        {
            path: ':courseSlug',
            name: PREVIEW_COURSE_ROUTES.coursePreview,
            component: CourseDetailsComponent
        }, {
            path: ':courseSlug/module/:moduleSlug',
            name: PREVIEW_COURSE_ROUTES.modulePreview,
            component: ModuleDetailsComponent
        }, {
            path: ':courseSlug/module/:moduleSlug/section/:sectionSlug',
            name: PREVIEW_COURSE_ROUTES.sectionPreview,
            component: ViewSectionComponent
        }
    ]
};
