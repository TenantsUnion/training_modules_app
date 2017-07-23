import {RouteConfig} from 'vue-router';
import LoginComponent from './login_component';

export const loginRoutes: RouteConfig[] = [
    {
        path: '/',
        name: 'login',
        component: {
            components: {
                'login-component': LoginComponent
            },
            //language=HTML
            template: `
                <login-component></login-component>
            `
        },
    }
];
