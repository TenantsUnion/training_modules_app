import {RouteConfig} from "vue-router";
import {CreateCourseComponent} from "../courses/create/create_course_component";
import {CreateContentComponent} from "./content/create_content/create_content_component";
import {AppHeader} from "./header/user_header_component";
import {ContentDescriptionListComponent} from "./content/content_description_list/content_description_list_component";
import {EditUserContentComponent} from "./content/edit/edit_user_content_component";
import {UserEnrolledCoursesComponent} from "./courses/enrolled/user_enrolled_courses_component";
import {UserAdminCourseComponent} from "./courses/admin/user_admin_courses_component";

export const userRoutes: RouteConfig[] = [
    {
        path: '/user/:username',
        name: 'user',
        props: true,
        children: [{
            path: 'enrolled-courses',
            name: 'enrolledCourses',
            props: true,
            component: UserEnrolledCoursesComponent,
        }, {
            path: 'admin-courses',
            name: 'adminCourses',
            props: true,
            component: UserAdminCourseComponent
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
            components: {
                'app-header': AppHeader
            },
            // language=HTML
            template: `
                <div>
                    <app-header :username="username"></app-header>
                    <router-view></router-view>
                </div>
            `
        }
    }
];
