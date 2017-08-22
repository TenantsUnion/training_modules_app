import {loginRoutes} from './account/account_routes';
import {adminRoutes} from './admin/admin_routes';
import VueRouter, {Route} from 'vue-router';
import {userRoutes} from "./user/user_routes";
import {userQueryService} from "./account/user_query_service";
import {accountHttpService} from "./account/account_http_service";

let router = new VueRouter({});

router.addRoutes([
    loginRoutes,
    adminRoutes,
    userRoutes
]);

router.beforeEach((to: Route, from, next) => {
    let username = to.params.username;
    if (username && !userQueryService.isUserLoggedIn()) {
        accountHttpService.getLoggedInUserInfo()
            .then((userInfo) => {
                userQueryService.setCurrentUser(userInfo);
                next();
            })
            .catch((errorMessages) => {
                next(new Error(errorMessages));
            });
    } else {
        next();
    }
});
export const appRouter = router;
