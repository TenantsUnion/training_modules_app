import * as express from 'express';
import {accountController} from "../config/web_controller.config";

let router = express.Router();
router.post('/account/login', (request, response) => {
    accountController.login(request, response);
});

router.post('/account/signup', (request, response) => {
    accountController.signup(request, response);
});

router.get('/account/userInfo', (request, response) => {
    accountController.getLoggedInUserInfo(request, response);
});

export const AccountRoutes = router;
