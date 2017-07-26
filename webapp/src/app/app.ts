import {appRouter} from './router';
import Vue from 'vue';
import VueRouter from 'vue-router';
import jQuery from 'jquery';
import {AppHeader} from "./app_header/app_header_component";

//global styling
require('foundation-sites');
require('./style.scss');

//put jquery on global window for debugging,
//workaround for webpack doing this with module number prefixes
let unTypedWindow = <any> window;
unTypedWindow.jQuery = jQuery;
unTypedWindow.$ = jQuery;

//global components
Vue.component('app-header', AppHeader);

Vue.use(VueRouter);
let app = new Vue({
    components: {},
    router: appRouter,
}).$mount('#app');