import {NavigationGuard, RouteConfig} from "vue-router";
import CreateContentComponent from "./content/create_content/create_content_component.vue";
import AppHeader from "./header/user_header_component.vue";
import ContentDescriptionListComponent from "./content/content_description_list/content_description_list_component.vue";
import EditUserContentComponent from "./content/edit/edit_user_content_component.vue";
import {coursesRoutes} from "../courses/courses_routes";
import {store} from '../state_store';
import {USER_ACTIONS} from '../courses/store/user/user_store';
import {appRouter} from '../router';
import {LOGIN_ROUTE} from '../account/account_routes';


const userInfoRefresh: NavigationGuard = async (to, from , next) => {
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
};

export const userRoutes: RouteConfig = {
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
        beforeRouteEnter: userInfoRefresh,
        beforeRouteUpdate: userInfoRefresh,
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
