import { appRouter } from './router';
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
var app = new Vue({
    data: {
        message: 'Welcome!'
    },
    components: {},
    router: appRouter,
}).$mount('#app');
