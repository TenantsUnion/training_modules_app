import { AdminNavBar, AdminNavBarProps } from './admin_nav_bar_component';
var vm = AdminNavBarProps;
var routes = [
    {
        path: "/admin/:" + vm.username,
        name: 'admin',
        props: true,
        component: {
            props: [vm.username],
            components: {
                'admin-nav-bar': AdminNavBar
            },
            //language=HTML
            template: "\n                <div>\n                    <admin-nav-bar :username=\"" + vm.username + "\"></admin-nav-bar>\n                </div>\n            "
        }
    }
];
export var adminRoutes = routes;
