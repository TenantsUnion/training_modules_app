import {appRouter} from './router';
import * as Vue from 'vue';

console.log('run');
let app = new Vue({
    data: {
        message: 'Welcome!'
    },
    components: {},
    router: appRouter
}).$mount('#app');