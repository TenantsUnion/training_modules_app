import {RouteConfig} from 'vue-router/types/router';
import {AdminNavBar, AdminNavBarProps} from './admin_nav_bar_component';

let vm = AdminNavBarProps;
let routes: RouteConfig[] = [
    {
        path: `/admin/:${vm.username}`,
        name: 'admin',
        props: true,
        component: {
            props: [vm.username],
            components: {
                'admin-nav-bar': AdminNavBar
            },
            //language=HTML
            template: `
                <div>
                    <admin-nav-bar :username="${vm.username}"></admin-nav-bar>
                </div>
            `
        }
    }
];


export const adminRoutes = routes;
