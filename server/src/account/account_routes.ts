import * as express from 'express';
import {Router, Response, Request} from 'express';
import {LoginCredentials} from 'account';
import {accountHandler, IAccountHandler} from './account_handler';
import {SignupData} from "./account";
import {IUserId} from "src/user/user_handler";

export class AccountController {
    constructor (private accountHandler: IAccountHandler) {
    }

    signup (request: Request, response: Response) {
        console.log('handling signup');
        let signupData: SignupData = request.body;
        (async () => {
            let userId: IUserId | string;
            try {
                userId = await this.accountHandler.signup(signupData);
            } catch (e) {
                console.log(e.stack);
                response.status(500) //server error
                    .send(e.stack.join('\n'));
            }

            if (typeof userId !== 'string') {
                request.session.user_id = userId.id;
                response.status(200)
                    .send(userId);
            } else {
                response.status(400)
                    .send(userId); //if userId is string it is an error message
            }
        })();
    }

    login (request: Request, response: Response) {
        console.log('handling login');
        let loginCredentials: LoginCredentials = request.body;
        (async () => {
            let userId: IUserId | string;
            try {

                userId = await this.accountHandler.login(loginCredentials);

            } catch (e) {
                console.log(e.stack);
                response.status(500)
                    .send(e.stack('\n'));
            }

            if (typeof userId !== 'string') {
                request.session.user_id = userId.id;
                response.status(200)
                    .send(userId);
            } else {
                response.status(400)
                    .send(userId); //if userId is string it is an error message
            }
        })();
    }
}

let accountController = new AccountController(accountHandler);

let router: Router = express.Router();
router.post('/login', (request, response) => {
    accountController.login(request, response);
});

router.post('/signup', (request, response) => {
    accountController.signup(request, response);
});

export const AccountRoutes = router;
