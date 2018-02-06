import {RouteConfig} from "vue-router";
import CourseComponent from './course_component/course_component.vue';
import CourseDetailsComponent from './course_details_component/course_details_component.vue';
import CreateModuleComponent from "./modules/create_module_component/create_module_component.vue";
import ModuleDetailsComponent from './modules/module_details_component/module_details_component.vue';
import CreateSectionComponent from './modules/sections/create/create_section_component.vue';
import ViewSectionComponent from './modules/sections/view/view_section_component.vue';
import EditSectionComponent from './modules/sections/edit/edit_section_component.vue';
import VueEditCourseComponent from './edit_course_component/edit_course_component.vue';
import EditModuleComponent from './modules/edit_modules_component/edit_module_component.vue';
import {ADMIN_COURSE_ROUTES, ENROLLED_COURSE_ROUTES, PREVIEW_COURSE_ROUTES} from "@global/routes";

export const CourseRoutes: RouteConfig = {
    path: 'course',
    props: true,
    component: CourseComponent,
    children: [
        {
            path: ':courseSlug',
            name: PREVIEW_COURSE_ROUTES.coursePreview,
            component: CourseDetailsComponent
        },
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
            path: ':courseSlug/module/:moduleSlug',
            name: PREVIEW_COURSE_ROUTES.modulePreview,
            component: ModuleDetailsComponent
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
            path: ':courseSlug/module/:moduleSlug/section/:sectionSlug',
            name: PREVIEW_COURSE_ROUTES.sectionPreview,
            component: ViewSectionComponent
        }, {
            path: ':courseSlug/module/:moduleSlug/section/:sectionSlug/edit',
            name: ADMIN_COURSE_ROUTES.editSection,
            props: true,
            component: EditSectionComponent
        }, {
            path: ':courseSlug/learning',
            name: ENROLLED_COURSE_ROUTES.enrolledCourse,
            component: CourseDetailsComponent
        }, {
            path: ':courseSlug/module/:moduleSlug/learning',
            name: ENROLLED_COURSE_ROUTES.enrolledModule,
            component: ModuleDetailsComponent
        }, {
            path: ':courseSlug/module/:moduleSlug/section/:sectionSlug/learning',
            name: ENROLLED_COURSE_ROUTES.enrolledSection,
            component: ViewSectionComponent
        }]
};
