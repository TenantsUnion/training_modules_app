import {appRouter} from './router';
import Vue from 'vue';
import VueRouter from 'vue-router';
import {AppHeader} from "./user/header/user_header_component";

//global styling
require('foundation-sites');
require('./_style.scss');

//global components
Vue.component('app-header', AppHeader);

Vue.use(VueRouter);
let app = new Vue({
    components: {},
    router: appRouter,
}).$mount('#app');

