import {appRouter} from './router';
import Vue from 'vue';
import {loginRoutes} from "./account/account_routes";
import {userRoutes} from "./user/user_routes";
import {store} from "./state_store";
import {registerGlobalComponents} from './globals';
import App from './app.vue';
import {availableCoursesRoutes} from "./available_courses/available_courses_routes";

// load javascript functionality for foundation
require('foundation-sites');

appRouter.addRoutes([
    loginRoutes,
    userRoutes,
    availableCoursesRoutes
]);

registerGlobalComponents();
let app = new Vue({
    components: {
        app: App
    },
    router: appRouter,
    store: store,
    template: `<app></app>`
}).$mount('#app');

