import {appRouter} from './router';
import Vuex from 'vuex';
import Vue from 'vue';
import {loginRoutes} from "./account/account_routes";
import {userRoutes} from "@user/user_routes";
import {registerGlobalComponents} from './globals';
import App from './app.vue';
import {availableCoursesRoutes} from "./available_courses/available_courses_routes";
import {Store} from "vuex";
import {RootState} from "@webapp_root/store";
import {storeConfig} from "@webapp_root/state_store";

// load javascript functionality for foundation
require('foundation-sites');

appRouter.addRoutes([
    loginRoutes,
    userRoutes,
    availableCoursesRoutes
]);

registerGlobalComponents();
Vue.use(Vuex);
export const store: Store<RootState> = new Vuex.Store(storeConfig);
let app = new Vue({
    components: {
        app: App
    },
    router: appRouter,
    store: store,
    template: `<app></app>`
}).$mount('#app');

