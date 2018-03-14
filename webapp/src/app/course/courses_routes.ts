import {NavigationGuard, RouteConfig} from "vue-router";
import CourseComponent from './course_component/course_component.vue';
import EditModuleComponent from "@module/edit_modules_component/edit_module_component.vue";
import {ADMIN_COURSE_ROUTES, ENROLLED_COURSE_ROUTES, PREVIEW_COURSE_ROUTES} from "@global/routes";
import ModuleDetailsComponent from "@module/module_details_component/module_details_component.vue";
import CreateSectionComponent from "@section/create/create_section_component.vue";
import ViewSectionComponent from "@section/view/view_section_component.vue";
import CourseDetailsComponent from "./course_details_component/course_details_component.vue";
import VueEditCourseComponent from "@course/edit_course_component/edit_course_component.vue";
import CreateModuleComponent from "@module/create_module_component/create_module_component.vue";
import EditSectionComponent from "@section/edit/edit_section_component.vue";
import {appRouter} from "../router";
import {USER_PROGRESS_ACTIONS} from "@user_progress/user_progress_store";
import {LOGIN_ROUTE} from "../account/account_routes";
import {appGetters, store} from "@webapp_root/app";

export const AdminCourseRoutes: RouteConfig = {
    path: 'admin/course',
    props: true,
    component: CourseComponent,
    children: [
        {
            path: ':courseSlug/edit',
            name: ADMIN_COURSE_ROUTES.editCourse,
            props: true,
            component: VueEditCourseComponent
        }, {
            path: ':courseSlug/module/create',
            name: ADMIN_COURSE_ROUTES.createModule,
            props: true,
            component: CreateModuleComponent
        }, {
            path: ':courseSlug/module/:moduleSlug/edit',
            name: ADMIN_COURSE_ROUTES.editModule,
            props: true,
            component: EditModuleComponent
        }, {
            path: ':courseSlug/module/:moduleSlug/section/create',
            name: ADMIN_COURSE_ROUTES.createSection,
            props: true,
            component: CreateSectionComponent
        }, {
            path: ':courseSlug/module/:moduleSlug/section/:sectionSlug/edit',
            name: ADMIN_COURSE_ROUTES.editSection,
            props: true,
            component: EditSectionComponent
        }]
};


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
