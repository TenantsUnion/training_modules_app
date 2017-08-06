import * as express from 'express';
import {Router, Response, Request} from 'express';
import {LoginCredentials} from 'account';
import {accountHandler, IAccountHandler} from './account_handler';
import {SignupData} from "./account";
import {
    AccountRequestValidator,
    accountRequestValidator
} from "./account_request_validation_service";

export class AccountController {
    constructor (private accountHandler: IAccountHandler,
                 private accountRequestValidator: AccountRequestValidator) {
    }

    signup (request: Request, response: Response) {
        console.log('handling signup');
        let signupData: SignupData = request.body;
        (async () => {
            try {
                let errorMsg = await this.accountRequestValidator.signup(signupData);
                if (errorMsg) {
                    return response.status(400).send(errorMsg);
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
        console.log('handling login');
        let loginCredentials: LoginCredentials = request.body;
        (async () => {
            try {
                let errorMsg = await this.accountRequestValidator.login(loginCredentials);
                if(errorMsg){
                    return response.status(400).send(errorMsg);
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
}

let accountController = new AccountController(accountHandler, accountRequestValidator);

let router: Router = express.Router();
router.post('/login', (request, response) => {
    accountController.login(request, response);
});

router.post('/signup', (request, response) => {
    accountController.signup(request, response);
});

export const AccountRoutes = router;
