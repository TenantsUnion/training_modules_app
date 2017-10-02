import {RouteConfig, default as VueRouter} from "vue-router";
import {UserEnrolledCoursesComponent} from "../user/courses/enrolled/user_enrolled_courses_component";
import {UserAdminCourseComponent} from "../user/courses/admin/user_admin_courses_component";
import {CreateCourseComponent} from "./create/create_course_component";
import {CourseComponent} from './course_component/course_component';
import {CourseDetailsComponent} from './course_details_component/course_details_component';
import {CreateModuleComponent} from "./modules/create_module_component/create_module_component";
import {ModuleDetailsComponent} from './modules/module_details_component/module_details_component';
import {appRouter} from '../router';
import {CreateSectionComponent} from './modules/sections/create/create_section_component';
import {ViewSectionComponent} from './modules/sections/view/view_section_component';
import {EditSectionComponent} from './modules/sections/edit/edit_section_component';
import {EditCourseComponent} from './edit_course_component/edit_course_component';
import {coursesService} from './courses_service';

export const COURSES_ROUTE_NAMES = {
    enrolledCourses: 'enrolledCourses',
    enrolledCourse: 'enrolledCourse',
    adminCourses: 'adminCourses',
    adminCourse: 'adminCourse',
    editCourse: 'adminCourse.editCourse',
    adminCourseDetails: 'adminCourse.courseDetails',
    createModule: 'adminCourse.createModule',
    moduleDetails: 'adminCourse.moduleDetails',
    editModule: undefined,
    createSection: 'adminCourse.createSection',
    editSection: 'course.editSection',
    viewSection: 'course.viewSection'
};

let courseTitle = 'courseTitle';

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
                path: ':courseTitle',
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
                path: ':courseTitle',
                name: COURSES_ROUTE_NAMES.adminCourseDetails,
                props: true,
                component: CourseDetailsComponent
            },
            {
                path: ':courseTitle/edit',
                name: COURSES_ROUTE_NAMES.editCourse,
                props: true,
                component: EditCourseComponent
            },
            {
                path: ':courseTitle/module/create',
                name: COURSES_ROUTE_NAMES.createModule,
                props: true,
                component: CreateModuleComponent
            },
            {
                path: ':courseTitle/module/:moduleTitle',
                name: COURSES_ROUTE_NAMES.moduleDetails,
                props: true,
                component: ModuleDetailsComponent
            },
            {
                path: ':courseTitle/module/:moduleTitle/edit',
                name: COURSES_ROUTE_NAMES.editModule
            },
            {
                path: ':courseTitle/module/:moduleTitle/section/create',
                name: COURSES_ROUTE_NAMES.createSection,
                props: true,
                component: CreateSectionComponent
            },
            {
                path: ':courseTitle/module/:moduleTitle/section/:sectionTitle',
                name: COURSES_ROUTE_NAMES.viewSection,
                beforeEnter: (to, from, next) => {
                    coursesService.refresh().then(() => next());
                },
                props: true,
                component: ViewSectionComponent
            },
            {
                path: ':courseTitle/module/:moduleTitle/section/:sectionTitle/edit',
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
        return this.router.currentRoute.params.courseTitle;
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
