import * as VueRouter from 'vue-router';
import {loginRoutes} from './login/login_route';
import {adminRoutes} from './admin/admin_routes';

let router = new VueRouter({});

router.addRoutes(loginRoutes);
router.addRoutes(adminRoutes);

export const appRouter = router;
