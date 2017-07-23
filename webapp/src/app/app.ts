import {appRouter} from './router';
import Vue from 'vue';
import VueRouter from 'vue-router';
import jQuery from 'jquery';

require('foundation-sites');
require('./style.scss');

let unTypedWindow = <any> window;

unTypedWindow.jQuery = jQuery;
unTypedWindow.$ = jQuery;


Vue.use(VueRouter);
let app = new Vue({
    components: {},
    router: appRouter,
}).$mount('#app');