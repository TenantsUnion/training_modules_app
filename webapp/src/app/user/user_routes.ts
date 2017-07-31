import {RouteConfig} from "vue-router";
import {LandingPageComponent} from "./landing_page_component";
import {CreateCourseComponent} from "../course/create/create_course_component";
import {ContentComponent} from "./content_component";
import {AppHeader} from "./header/header_component";

export const userRoutes: RouteConfig[] = [
        {
            path: '/user/:username',
            name: 'user',
            props: true,
            children: [{
                path: '/',
                name: 'user.landing',
                props: true,
                component: LandingPageComponent,
            }, {
                path: '/course/create',
                name: 'course.create',
                props: true,
                component: CreateCourseComponent
            }, {
                path: '/content',
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
