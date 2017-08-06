import {LoginCredentials, WebappSignupData} from "account";
import {accountRepository, IAccountRepository} from "./account_repository";
import {IUserHandler, AccountInfo, userHandler} from "../user/user_handler";

export interface IAccountHandler {
    signup(signupInfo: WebappSignupData): Promise<AccountInfo>;
    login(loginCredentials: LoginCredentials): Promise<AccountInfo>;
}

export class AccountHandler implements IAccountHandler {
    constructor (private accountRepository: IAccountRepository,
                 private userHandler: IUserHandler) {
    }

    async signup (signupInfo: WebappSignupData): Promise<AccountInfo> {
        return new Promise<AccountInfo>((resolve, reject) => {
            (async () => {
                try {
                    let accountId = await this.accountRepository.createAccount(signupInfo);
                    let userId = await this.userHandler.createUser({
                        id: accountId,
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

    async login (loginCredentials: LoginCredentials): Promise<AccountInfo> {
        return new Promise<AccountInfo>((resolve, reject) => {
            (async () => {
                try {
                    let accountInfo = await this.accountRepository.findAccountByUsername(loginCredentials.username);
                    //todo compare passwords
                    resolve(accountInfo);
                } catch (e) {
                    reject(e);
                }
            })();
        });
    }
}

export const accountHandler = new AccountHandler(accountRepository, userHandler);
