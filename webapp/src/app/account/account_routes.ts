import {RouteConfig} from 'vue-router';
import LoginComponent from './login/login_component.vue';
import SignupComponent from "./signup/signup_component.vue";
import * as VueForm from "../vue-form";
import {FormField} from "../vue-form";


export const LOGIN_ROUTE = '/login';
export const SIGNUP_ROUTE = '/signup';

export interface AccountFormState extends VueForm.FormState {
    username: FormField;
}
export const loginRoutes: RouteConfig = {
    path: '/',
    name: 'landing',
    children: [
        {
            path: LOGIN_ROUTE,
            name: 'login',
            component: LoginComponent
        }, {
            path: SIGNUP_ROUTE,
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
                        <router-link class="login-nav" role="tab" :to='{name:"login"}'>Login
                        </router-link>
                    </li>
                    <li class="tabs-title" role="presentation">
                        <router-link class="signup-nav" role="tab" :to="{name: 'signup'}">
                            Signup
                        </router-link>
                    </li>
                </ul>
                <div class="tabs-content">
                    <div role="tabpanel" aria-hidden="false"
                         class="content active">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        `
    },
};
