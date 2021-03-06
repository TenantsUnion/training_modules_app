import {Router} from 'express';
import {accountController} from "./web_controller_config";

let router = Router();
router.post('/account/login', (request, response) => {
    return accountController.login(request, response);
});

router.post('/account/logout', (request, response) => {
    return accountController.logout(request, response);
});

router.post('/account/signup', (request, response) => {
    return accountController.signup(request, response);
});

router.get('/account/user-info/:username', (request, response) => {
    return accountController.getLoggedInUserInfo(request, response);
});

export const AccountRoutes = router;
