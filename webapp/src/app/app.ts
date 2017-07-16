import {appRouter} from './router';
import * as Vue from 'vue';

let app = new Vue({
    data: {
        message: 'Welcome!'
    },
    components: {},
    router: appRouter
}).$mount('#app');