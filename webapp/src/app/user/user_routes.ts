import {RouteConfig} from "vue-router";
import {CreateContentComponent} from "./content/create_content/create_content_component";
import {AppHeader} from "./header/user_header_component";
import {ContentDescriptionListComponent} from "./content/content_description_list/content_description_list_component";
import {EditUserContentComponent} from "./content/edit/edit_user_content_component";
import {coursesRoutes} from "../courses/courses_routes";
import * as _ from "underscore";
import {store} from '../state_store';
import {USER_ACTIONS} from '../courses/store/user/user_store';
import {appRouter} from '../router';
import {LOGIN_ROUTE} from '../account/account_routes';


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
            /**
             * If vue route matches username param then check if user is logged or redirect to login page
             */
            async beforeRouteUpdate(to, from, next) {
                let username = to.params.username;
                if (username) {
                    await store.dispatch(USER_ACTIONS.LOAD_INFO_FROM_USER_SESSION, username);
                    if (!store.state.user.loggedIn) {
                        appRouter.push({path: LOGIN_ROUTE});
                    } else {
                        next();
                    }
                } else {
                    next();
                }
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
