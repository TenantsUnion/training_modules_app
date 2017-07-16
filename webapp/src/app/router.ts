import {loginRoutes} from './login/login_route';
import {adminRoutes} from './admin/admin_routes';
import * as VueRouter from 'vue-router';

let router = new VueRouter({});

router.addRoutes(loginRoutes);
router.addRoutes(adminRoutes);

export const appRouter = router;
