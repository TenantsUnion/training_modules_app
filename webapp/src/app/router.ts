import {loginRoutes} from './account/account_routes';
import {adminRoutes} from './admin/admin_routes';
import VueRouter from 'vue-router';
import Vue from 'vue';
import {userRoutes} from "./user/user_routes";

let router = new VueRouter({});

router.addRoutes(loginRoutes);
router.addRoutes(adminRoutes);
router.addRoutes(userRoutes);

//todo  when going to '/' check if user is logged in and if so go to user page, if not go to findAccountByUsername


export const appRouter = router;
