import {RouteConfig} from "vue-router";
import {UserCoursesComponent} from "./user_courses_component";
import {CreateCourseComponent} from "../courses/create/create_course_component";
import {ContentComponent} from "./create_content/create_content_component";
import {AppHeader} from "./header/user_header_component";

export const userRoutes: RouteConfig[] = [
        {
            path: '/user/:username',
            name: 'user',
            props: true,
            children: [{
                path: 'courses',
                name: 'courses',
                props: true,
                component: UserCoursesComponent,
            }, {
                path: 'course/create',
                name: 'create',
                props: true,
                component: CreateCourseComponent
            }, {
                path: 'content',
                name: 'content',
                props: true,
                component: ContentComponent
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
    ]
;
