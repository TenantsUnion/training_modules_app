import {RouteConfig} from "vue-router";
import {ADMIN_COURSE_ROUTES} from "@webapp/global/routes";
import CourseComponent from "@webapp/course/course_component/course_component.vue";
import VueEditCourseComponent from "@webapp/course/edit_course_component/edit_course_component.vue";
import CreateModuleComponent from "@webapp/module/create_module_component/create_module_component.vue";
import EditSectionComponent from "@webapp/section/edit/edit_section_component.vue";
import CreateSectionComponent from "@webapp/section/create/create_section_component.vue";
import EditModuleComponent from "@webapp/module/edit_modules_component/edit_module_component.vue";
import CourseEnrolledProgressComponent from "@course/course_enrolled_progress/course_enrolled_progress_component.vue";

export const AdminCourseRoutes: RouteConfig[] = [
    {
        path: 'admin/course/:courseSlug',
        props: true,
        component: CourseComponent,
        children: [
            {
                path: 'edit',
                name: ADMIN_COURSE_ROUTES.editCourse,
                props: true,
                component: VueEditCourseComponent
            }, {
                path: 'create',
                name: ADMIN_COURSE_ROUTES.createModule,
                props: true,
                component: CreateModuleComponent
            }, {
                path: 'edit',
                name: ADMIN_COURSE_ROUTES.editModule,
                props: true,
                component: EditModuleComponent
            }, {
                path: 'module/:moduleSlug/section/create',
                name: ADMIN_COURSE_ROUTES.createSection,
                props: true,
                component: CreateSectionComponent
            }, {
                path: 'module/:moduleSlug/section/:sectionSlug/edit',
                name: ADMIN_COURSE_ROUTES.editSection,
                props: true,
                component: EditSectionComponent
            }]
    }, {
        path: 'admin/course/:courseSlug/enrolled-users',
        name: ADMIN_COURSE_ROUTES.enrolledUsers,
        props: true,
        component: CourseEnrolledProgressComponent
    }];
