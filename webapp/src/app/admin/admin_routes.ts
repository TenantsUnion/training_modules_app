import {AdminNavBar} from './admin_nav_bar_component';
import {RouteConfig} from 'vue-router';
import {AdminModulesList} from "./admin_modules_list_component";

let routes: RouteConfig[] = [
    {
        path: `/admin/:username`,
        name: 'admin',
        props: true,
        component: {
            props: ['username'],
            components: {
                'admin-nav-bar': AdminNavBar,
                'admin-modules-list': AdminModulesList
            },
            //language=HTML
            template: `
                <div>
                    <admin-nav-bar :username="username"></admin-nav-bar>
                    <admin-modules-list></admin-modules-list>
                </div>
            `
        }
    }
];


export const adminRoutes = routes;
