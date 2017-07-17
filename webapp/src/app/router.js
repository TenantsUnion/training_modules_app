import { loginRoutes } from './login/login_route';
import { adminRoutes } from './admin/admin_routes';
import VueRouter from 'vue-router';
var router = new VueRouter({});
router.addRoutes(loginRoutes);
router.addRoutes(adminRoutes);
export var appRouter = router;
