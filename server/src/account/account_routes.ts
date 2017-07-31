import * as express from 'express';
import {Router, Response, Request} from 'express';
import {LoginCredentials, LoginResponse} from 'account.d.ts';
import {IUserInfo, USER_ROLE} from 'user';

class AccountController {

    signup(request: Request, response: Response) {

    }

    login(request: Request, response: Response) {
        let loginCredentials: LoginCredentials = request.body;
        let username = loginCredentials.username;
        let password = loginCredentials.password;

        //todo account against database

        let role: USER_ROLE = username.match('admin') ? USER_ROLE.admin : USER_ROLE.student;

        let responseBody: IUserInfo = {
            username: username,
            role: role
        };

        response.status(200);
        response.send(responseBody);
    }
}


let loginController = new AccountController();

let router: Router = express.Router();
router.post('/account', loginController.login);

export const LoginRoute = router;
