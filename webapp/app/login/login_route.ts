import {RouteConfig} from 'vue-router/types/router';

export const loginRoutes: RouteConfig[] = [
    {
        path: '/login',
        name: 'login',
        //language=HTML
        component: {
            template: `
                <p>login screen</p>
            `
        }
    }
];
