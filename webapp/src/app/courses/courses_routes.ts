import {RouteConfig, default as VueRouter} from "vue-router";
import {UserEnrolledCoursesComponent} from "../user/courses/enrolled/user_enrolled_courses_component";
import {UserAdminCourseComponent} from "../user/courses/admin/user_admin_courses_component";
import CreateCourseComponent from "./create/create_course_component.vue";
import CourseComponent from './course_component/course_component.vue';
import CourseDetailsComponent from './course_details_component/course_details_component.vue';
import CreateModuleComponent from "./modules/create_module_component/create_module_component.vue";
import ModuleDetailsComponent from './modules/module_details_component/module_details_component.vue';
import {appRouter} from '../router';
import {CreateSectionComponent} from './modules/sections/create/create_section_component';
import {ViewSectionComponent} from './modules/sections/view/view_section_component';
import {EditSectionComponent} from './modules/sections/edit/edit_section_component';
import VueEditCourseComponent from './edit_course_component/edit_course_component.vue';
import EditModuleComponent from './modules/edit_modules_component/edit_module_component.vue';

export const COURSES_ROUTE_NAMES = {
    enrolledCourses: 'enrolledCourses',
    enrolledCourse: 'enrolledCourse',
    enrolledCourseDetails: 'enrolledCourse.courseDetails',
    adminCourses: 'adminCourses',
    adminCourse: 'adminCourse',
    editCourse: 'adminCourse.editCourse',
    adminCourseDetails: 'adminCourse.courseDetails',
    createModule: 'adminCourse.createModule',
    moduleDetails: 'adminCourse.moduleDetails',
    editModule: 'admin.editModule',
    createSection: 'adminCourse.createSection',
    editSection: 'course.editSection',
    viewSection: 'course.viewSection'
};

export const coursesRoutes: RouteConfig[] = [
    {
        path: 'enrolled-courses',
        name: COURSES_ROUTE_NAMES.enrolledCourses,
        props: true,
        component: UserEnrolledCoursesComponent
    },
    {
        path: 'enrolled-course',
        name: COURSES_ROUTE_NAMES.enrolledCourse,
        props: true,
        component: CourseComponent,
        children: [
            {
                path: ':courseSlug',
                name: 'enrolledCourse.courseDetails',
                props: true,
                component: CourseDetailsComponent

            }
        ]
    },
    {
        path: 'admin-courses',
        name: COURSES_ROUTE_NAMES.adminCourses,
        props: true,
        component: UserAdminCourseComponent
    },
    {
        path: 'admin-course',
        name: COURSES_ROUTE_NAMES.adminCourse,
        props: true,
        component: CourseComponent,
        children: [
            {
                path: ':courseSlug',
                name: COURSES_ROUTE_NAMES.adminCourseDetails,
                props: true,
                component: CourseDetailsComponent
            },
            {
                path: ':courseSlug/edit',
                name: COURSES_ROUTE_NAMES.editCourse,
                props: true,
                component: VueEditCourseComponent
            },
            {
                path: ':courseSlug/module/create',
                name: COURSES_ROUTE_NAMES.createModule,
                props: true,
                component: CreateModuleComponent
            },
            {
                path: ':courseSlug/module/:moduleSlug',
                name: COURSES_ROUTE_NAMES.moduleDetails,
                props: true,
                component: ModuleDetailsComponent
            },
            {
                path: ':courseSlug/module/:moduleSlug/edit',
                name: COURSES_ROUTE_NAMES.editModule,
                props: true,
                component: EditModuleComponent
            },
            {
                path: ':courseSlug/module/:moduleSlug/section/create',
                name: COURSES_ROUTE_NAMES.createSection,
                props: true,
                component: CreateSectionComponent
            },
            {
                path: ':courseSlug/module/:moduleSlug/section/:sectionSlug',
                name: COURSES_ROUTE_NAMES.viewSection,
                props: true,
                component: ViewSectionComponent
            },
            {
                path: ':courseSlug/module/:moduleSlug/section/:sectionSlug/edit',
                name: COURSES_ROUTE_NAMES.editSection,
                props: true,
                component: EditSectionComponent
            }
        ]
    },
    {
        path: 'course/create',
        name: 'create',
        props: true,
        component: CreateCourseComponent
    }
];

export class CoursesRoutesService {
    constructor(private router: VueRouter) {
    }

    getCurrentModuleTitle() {
        return this.router.currentRoute.params.moduleTitle;
    }

    getCurrentCourse() {
        return this.router.currentRoute.params.courseSlug;
    }

    getCurrentUser() {
        return this.router.currentRoute.params.username;
    }

    getCurrentSectionTitle() {
        return this.router.currentRoute.params.sectionTitle;
    }

    isCourseAdmin() {
        return this.router.currentRoute.matched.some((matchedRoute) => {
            return matchedRoute.name === 'adminCourse';
        });
    }

}

export const coursesRoutesService = new CoursesRoutesService(appRouter);
