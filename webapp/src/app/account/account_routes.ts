import {RouteConfig} from 'vue-router';
import LoginComponent from './login/login_component';
import SignupComponent from "./signup/signup_component";

export const loginRoutes: RouteConfig[] = [
    {
        path: '/',
        name: 'account',
        children: [
            {
                path: '/login',
                name: 'login',
                component: LoginComponent
            }, {
                path: '/signup',
                name: 'signup',
                component: SignupComponent
            }
        ],
        component: {
            //language=HTML
            template: `
                <div>
                    <ul class="tabs" role="tablist">
                        <li class="tabs-title active" role="presentation">
                            <router-link role="tab" :to='{name:"login"}'>Login</router-link>
                        </li>
                        <li class="tabs-title" role="presentation">
                            <router-link role="tab" :to="{name: 'signup'}">Signup</router-link>
                        </li>
                    </ul>
                    <div class="tabs-content">
                        <div role="tabpanel" aria-hidden="false" class="content active">
                            <router-view></router-view>
                        </div>
                    </div>
                </div>
            `
        },
    }
];
