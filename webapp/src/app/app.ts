import {appRouter} from './router';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueForm from 'vue-form';
import {AppHeader} from "./user/header/user_header_component";
import {loginRoutes} from "./account/account_routes";
import {userRoutes} from "./user/user_routes";
import {coursesService} from './courses/courses_service';

// load javascript functionality for foundation
require('foundation-sites');
// entry point for loading sass files
require('./_style.scss');

//global global_components
Vue.component('app-header', AppHeader);

Vue.use(VueRouter);
Vue.use(VueForm);


appRouter.addRoutes([
    loginRoutes,
    userRoutes
]);

let app = new Vue({
    components: {},
    router: appRouter,
}).$mount('#app');

