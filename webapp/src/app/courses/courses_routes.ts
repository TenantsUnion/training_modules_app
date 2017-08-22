import {RouteConfig} from "vue-router";
import {ModuleSkeleton} from "./modules/module_skeleton_component/module_skeleton_component";
import {UserEnrolledCoursesComponent} from "../user/courses/enrolled/user_enrolled_courses_component";
import {UserAdminCourseComponent} from "../user/courses/admin/user_admin_courses_component";
import {CreateCourseComponent} from "./create/create_course_component";

export const coursesRoutes: RouteConfig[] = [
    {
        path: 'enrolled-courses',
        name: 'enrolledCourses',
        props: true,
        component: UserEnrolledCoursesComponent
    },
    {
        path: 'enrolled-courses/:title',
        name: 'adminCourse',
        props: true,
        component: ModuleSkeleton
    },
    {
        path: 'admin-courses',
        name: 'adminCourses',
        props: true,
        component: UserAdminCourseComponent,
    },
    {
        path: 'admin-courses/:title',
        name: 'enrolledCourse',
        props: true,
        component: ModuleSkeleton
    },
    {
        path: 'course/create',
        name: 'create',
        props: true,
        component: CreateCourseComponent
    }
];
