import {loginRoutes} from './login/login_route';
import {adminRoutes} from './admin/admin_routes';
import VueRouter from 'vue-router';
import Vue from 'vue';

let router = new VueRouter({});

router.addRoutes(loginRoutes);
router.addRoutes(adminRoutes);


export const appRouter = router;
