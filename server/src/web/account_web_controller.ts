import {IAccountHandler} from '../handlers/account/account_handler';
import {AccountRequestValidator} from "../handlers/account/account_request_validation_service";
import {IUserHandler} from "../handlers/user/user_handler";
import {Response, Request} from "express";
import {LoggerInstance} from 'winston';
import {getLogger} from '../log';
import {LoginCredentials, SignupData} from '@shared/account';
import {IUserInfo} from '@shared/user';

export class AccountController {
    private logger: LoggerInstance = getLogger('AccountController', 'info');

    constructor(private accountHandler: IAccountHandler,
                private userHandler: IUserHandler,
                private accountRequestValidator: AccountRequestValidator) {}

    async signup(request: Request, response: Response) {
        let signupData: SignupData = request.body;
        try {
            let errorMessages = await this.accountRequestValidator.signup(signupData);
            if (errorMessages) {
                this.logger.error(`Sign up validation errors username: ${signupData.username}\n
                    Error messages: ${JSON.stringify(errorMessages, null, 2)}`);
                response.status(400).send(errorMessages);
                return;
            }

            let accountInfo = await this.accountHandler.signup(signupData);
            setSession(request, accountInfo);
            response.status(200).send(accountInfo);
        } catch (e) {
            this.logger.error(`${e}`);
            this.logger.error(`${e.stack}`);
            response.status(500).send(e);
        }
    }

    async login(request: Request, response: Response) {
        let loginCredentials: LoginCredentials = request.body;
        try {
            let errorMessages = await this.accountRequestValidator.login(loginCredentials);
            if (errorMessages) {
                this.logger.error(`Login validation errors username: ${loginCredentials.username}\n
                    Error messages: ${JSON.stringify(errorMessages, null, 2)}`);
                return response.status(400).send(errorMessages);
            }
            let accountInfo = await this.accountHandler.login(loginCredentials);
            setSession(request, accountInfo);
            response.status(200).send(accountInfo);
        } catch (e) {
            this.logger.error(`${e}`);
            this.logger.error(`${e.stack}`);
            response.status(500).send(e);
        }
    }

    async logout(request: Request, response: Response) {
        try {
            let userId = request.session.user_id;
            await new Promise((resolve, reject) => {
                request.session.destroy(function (err) {
                    err ? reject(err) : resolve();
                });
            });
            this.logger.info(`Logged out ${userId}`);
            response.sendStatus(200);
        } catch (e) {
            this.logger.error(`${e}`);
            this.logger.error(`${e.stack}`);
            response.status(500).send(e);
        }
    }

    async getLoggedInUserInfo(request: Request, response: Response) {
        let {username} = request.params;
        if (request.session && request.session.userId && request.session.username === username) {
            try {
                let userAccountInfo = await this.userHandler.loadUser(request.session.userId);
                response.status(200).send(userAccountInfo);
            } catch (e) {
                this.logger.error(`${e}`);
                this.logger.error(`${e.stack}`);
                response.status(500).send(e);
            }
        } else {
            this.logger.info(`No session to load`);
            // todo should probably be an error response
            response.sendStatus(200);
        }
    }
}

const setSession = (request: Request, userInfo: IUserInfo) => {
    request.session.userId = userInfo.id;
    request.session.username = userInfo.username;
};

export const loggedInUserId = (request: Request): string | null => {
  return request.session && request.session.userId;
};
