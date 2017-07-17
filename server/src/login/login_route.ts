import * as express from 'express';
import {Router, Response, Request} from 'express';
import {LoginCredentials, LoginResponseBody} from 'login';
import {USER_ROLE} from 'user';

class LoginController {

    login(request: Request, response: Response) {
        let loginCredentials:LoginCredentials = request.body;
        let username = loginCredentials.username;
        let password = loginCredentials.password;

        //todo login against database

        let role: USER_ROLE = username === 'admin' ? USER_ROLE.admin : USER_ROLE.trainee;

        let responseBody: LoginResponseBody = {
            loginSuccessful: true,
            userInfo: {
                username: username,
                role: role
            }
        };

        response.status(200);
        response.send(responseBody);
    }
}


let loginController = new LoginController();

let router: Router = express.Router();
router.post('/login', loginController.login);

export const LoginRoute = router;
