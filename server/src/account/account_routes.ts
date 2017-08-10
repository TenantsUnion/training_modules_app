import * as express from 'express';
import {Router, Response, Request} from 'express';
import {LoginCredentials} from 'account';
import {accountHandler, IAccountHandler} from './account_handler';
import {SignupData} from "./account";
import {
    AccountRequestValidator,
    accountRequestValidator
} from "./account_request_validation_service";
import {IUserHandler, userHandler} from "../user/user_handler";

export class AccountController {
    constructor (private accountHandler: IAccountHandler,
                 private userHandler: IUserHandler,
                 private accountRequestValidator: AccountRequestValidator) {
    }

    signup (request: Request, response: Response) {
        console.log('handling signup');
        let signupData: SignupData = request.body;
        (async () => {
            try {
                let errorMessages = await this.accountRequestValidator.signup(signupData);
                if (errorMessages) {
                    return response.status(400).send(errorMessages);
                }

                let accountInfo = await this.accountHandler.signup(signupData);
                request.session.user_id = accountInfo.id;
                response.status(200).send(accountInfo);
            } catch (e) {
                console.log(e.stack);
                response.status(500) //server error
                    .send(e.stack.join('\n'));
            }
        })();
    }

    login (request: Request, response: Response) {
        let loginCredentials: LoginCredentials = request.body;
        (async () => {
            try {
                let errorMessages = await this.accountRequestValidator.login(loginCredentials);
                if (errorMessages) {
                    return response.status(400).send(errorMessages);
                }
                let accountInfo = await this.accountHandler.login(loginCredentials);
                request.session.user_id = accountInfo.id;
                response.status(200).send(accountInfo);
            } catch (e) {
                console.log(e.stack);
                response.status(500).send(e.stack('\n'));
            }
        })();
    }

    getLoggedInUserInfo (request: Request, response: Response) {
        if (request.session && request.session.user_id) {
            (async () => {
                try {
                    let userAccountInfo = await this.userHandler.loadUser(request.session.user_id);
                    response.status(200).send(userAccountInfo);
                } catch (e) {
                    response.status(500)
                        .send(e);
                }

            })();
        }
    }
}

let accountController = new AccountController(accountHandler, userHandler,
    accountRequestValidator);

let router: Router = express.Router();
router.post('/login', (request, response) => {
    accountController.login(request, response);
});

router.post('/signup', (request, response) => {
    accountController.signup(request, response);
});

router.get('/userInfo', (request, response) => {
    accountController.getLoggedInUserInfo(request, response);
});
export const AccountRoutes = router;
