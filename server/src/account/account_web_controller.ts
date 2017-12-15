import {IAccountHandler} from './account_handler';
import {AccountRequestValidator} from "./account_request_validation_service";
import {IUserHandler} from "../user/user_handler";
import {Response, Request} from "express";
import {LoggerInstance} from 'winston';
import {getLogger} from '../log';
import {LoginCredentials, SignupData} from 'account';

export class AccountController {
    private logger: LoggerInstance = getLogger('AccountController', 'info');

    constructor(private accountHandler: IAccountHandler,
                private userHandler: IUserHandler,
                private accountRequestValidator: AccountRequestValidator) {
    }

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
            request.session.user_id = accountInfo.id;
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
            request.session.user_id = accountInfo.id;
            response.status(200).send(accountInfo);
        } catch (e) {
            this.logger.error(`${e}`);
            this.logger.error(`${e.stack}`);
            response.status(500).send(e);
        }
    }

    async getLoggedInUserInfo(request: Request, response: Response) {
        if (request.session && request.session.user_id) {
            try {
                let userAccountInfo = await this.userHandler.loadUser(request.session.user_id);
                response.status(200).send(userAccountInfo);
            } catch (e) {
                this.logger.error(`${e}`);
                this.logger.error(`${e.stack}`);
                response.status(500).send(e);
            }
        } else {
            response.sendStatus(200);
        }
    }
}

