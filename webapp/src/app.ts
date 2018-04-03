import {storeMixin} from "@store/store_mixin";
import {appRouter, initRouter} from './app_router';
import Vue from 'vue';
import {jqueryMixin, registerGlobalComponents} from './globals';
import App from './app.vue';
import {store} from "@webapp/store/store";
import {refsVueMixin} from '@components/refs_mixin';

registerGlobalComponents();

// route modules use store and appGetters so they should be initiazized after that part of app.ts is done
// otherwise the circular dependency is avoided by webpack initializing the route configs to null
initRouter();
jqueryMixin();
storeMixin();
refsVueMixin();

let app = new Vue({
    components: {
        app: App
    },
    router: appRouter,
    store: store,
    template: `<app></app>`
}).$mount('#app');



// load javascript functionality for foundation
require('foundation-sites');
