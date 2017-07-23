import {appRouter} from './router';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
let app = new Vue({
    data: {
        message: 'Welcome  message!'
    },
    components: {},
    router: appRouter,
}).$mount('#app');