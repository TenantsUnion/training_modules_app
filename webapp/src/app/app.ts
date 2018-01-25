import {appRouter} from './router';
import Vue from 'vue';
import {loginRoutes} from "./account/account_routes";
import {userRoutes} from "./user/user_routes";
import {store} from "./state_store";
import {registerGlobalComponents} from './globals';

// load javascript functionality for foundation
require('foundation-sites');
// entry point for loading sass files
require('./_style.scss');



appRouter.addRoutes([
    loginRoutes,
    userRoutes
]);

// appRouter.beforeEach(async function (to: Route, from: Route, next) {
//     let username = to.params.username;
//     if (username) {
//         await store.dispatch(USER_ACTIONS.LOAD_INFO_FROM_USER_SESSION, username);
//         if (!store.state.user.loggedIn) {
//             appRouter.push({path: LOGIN_ROUTE});
//         } else {
//             next();
//         }
//     } else {
//         next();
//     }
// });

registerGlobalComponents();
let app = new Vue({
    components: {},
    router: appRouter,
    store: store,
}).$mount('#app');

