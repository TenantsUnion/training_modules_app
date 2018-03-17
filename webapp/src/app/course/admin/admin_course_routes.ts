import {RouteConfig} from "vue-router";
import CourseComponent from "@course/course_component/course_component.vue";
import {ADMIN_COURSE_ROUTES} from "@global/routes";
import VueEditCourseComponent from "@course/edit_course_component/edit_course_component.vue";
import CreateModuleComponent from "@module/create_module_component/create_module_component.vue";
import EditSectionComponent from "@section/edit/edit_section_component.vue";
import CreateSectionComponent from "@section/create/create_section_component.vue";
import EditModuleComponent from "@module/edit_modules_component/edit_module_component.vue";

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
        component: {
            template: `<p>Hello, this is the enrolled users page!</p>`,
        }
    }];
