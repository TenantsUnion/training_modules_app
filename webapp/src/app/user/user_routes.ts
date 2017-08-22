import {RouteConfig} from "vue-router";
import {CreateContentComponent} from "./content/create_content/create_content_component";
import {AppHeader} from "./header/user_header_component";
import {ContentDescriptionListComponent} from "./content/content_description_list/content_description_list_component";
import {EditUserContentComponent} from "./content/edit/edit_user_content_component";
import {coursesRoutes} from "../courses/courses_routes";
import * as _ from "underscore";


export const userRoutes: RouteConfig =
    {
        path: '/user/:username',
        name: 'user',
        props: true,
        children: [
            {
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
    };

userRoutes.children = userRoutes.children.concat(coursesRoutes);
