import {LoginCredentials, WebappSignupData} from "account";
import {accountRepository, IAccountRepository} from "./account_repository";
import {IUserInfo} from "user";
import {IUserHandler, IUserId, userHandler} from "../user/user_handler";

export interface IAccountHandler {
    signup(signupInfo: WebappSignupData): Promise<IUserId | string>;
    login(loginCredentials: LoginCredentials): Promise<IUserId | string>;
}

export class AccountHandler implements IAccountHandler {
    constructor(private accountRepository: IAccountRepository,
                private userHandler: IUserHandler) {
    }

    async signup(signupInfo: WebappSignupData): Promise<IUserId | string> {
        return new Promise<IUserId | string>((resolve, reject) => {
            if (!signupInfo.username) {
                return resolve('Need username in order to createAccount');
            }

            (async () => {
                try {
                    let accountExists = await this.accountRepository.accountExists(signupInfo.username);
                    if (accountExists) {
                        return resolve(`Account with username: ${signupInfo.username} already exists`);
                    }
                    await this.accountRepository.createAccount(signupInfo);
                    let userId = await this.userHandler.createUser({
                        username: signupInfo.username
                    });

                    resolve(userId);
                } catch (e) {
                    console.log(e.stack);
                    reject(e);
                }
            })();
        });
    }

    async login(loginCredentials: LoginCredentials): Promise<IUserId | string> {
        return new Promise<IUserId | string>((resolve, reject) => {
            if (!loginCredentials.username){
                resolve(`Username required for login`);
            }

            (async () => {
                let exists = await this.accountRepository.accountExists(loginCredentials.username);
                if(!exists){
                    return resolve(`No account found that matches username ${loginCredentials.username}`);
                }
                let accountInfo = await this.accountRepository.findAccountByUsername(loginCredentials.username);
                //todo compare passwords
                let userId = await this.userHandler.getIdFromUsername(accountInfo.username);
                resolve(userId);
            })();
        });
    }
}

export const accountHandler = new AccountHandler(accountRepository, userHandler);
