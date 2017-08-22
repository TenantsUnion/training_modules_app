import {AdminNavigation} from './admin_navigation_component';
import {RouteConfig} from 'vue-router';
import {ModuleSkeleton} from '../courses/modules/module_skeleton_component/module_skeleton_component';

let routes: RouteConfig = {
    path: `/admin/:username`,
    name: 'admin',
    props: true,
    children: [
        {
            path: 'modules',
            name: 'admin.modules',
            component: ModuleSkeleton
        }
    ],
    component: {
        props: ['username'],
        components: {
            'admin-navigation': AdminNavigation
        },
        //language=HTML
        template: `
            <div>
                <app-header :username="username"></app-header>
                <admin-navigation>
                    <router-view></router-view>
                </admin-navigation>
            </div>
        `
    }
};


export const adminRoutes = routes;
