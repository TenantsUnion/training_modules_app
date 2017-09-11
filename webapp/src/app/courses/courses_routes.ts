import {RouteConfig} from "vue-router";
import {UserEnrolledCoursesComponent} from "../user/courses/enrolled/user_enrolled_courses_component";
import {UserAdminCourseComponent} from "../user/courses/admin/user_admin_courses_component";
import {CreateCourseComponent} from "./create/create_course_component";
import {CourseComponent} from './course_component/course_component';
import {CourseDetailsComponent} from './course_details_component/course_details_component';
import {CreateModuleComponent} from "./modules/create_module_component/create_module_component";

export const coursesRoutes: RouteConfig[] = [
    {
        path: 'enrolled-courses',
        name: 'enrolledCourses',
        props: true,
        component: UserEnrolledCoursesComponent
    },
    {
        path: 'enrolled-course',
        name: 'enrolledCourse',
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
        name: 'adminCourses',
        props: true,
        component: UserAdminCourseComponent
    },
    {
        path: 'admin-course',
        name: 'adminCourse',
        props: true,
        component: CourseComponent,
        children: [
            {
                path: ':courseTitle',
                name: 'adminCourse.courseDetails',
                props: true,
                component: CourseDetailsComponent
            },
            {
                path: ':courseTitle/module/create',
                name: 'adminCourse.createModule',
                props: true,
                component: CreateModuleComponent
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

