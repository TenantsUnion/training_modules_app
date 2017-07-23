import {loginRoutes} from './login/login_route';
import {adminRoutes} from './admin/admin_routes';
import VueRouter from 'vue-router';
import Vue from 'vue';

let router = new VueRouter({});

router.addRoutes(loginRoutes);
router.addRoutes(adminRoutes);

//todo  when going to '/' check if user is logged in and if so go to user page, if not go to login


export const appRouter = router;
