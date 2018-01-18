import {LoginCredentials, AccountSignupRequest} from "@shared/account";
import {IAccountRepository} from "./account_repository";
import {IUserHandler} from "../user/user_handler";
import {IUserInfo} from "@shared/user";
import {getLogger} from '../log';

export interface IAccountHandler {
    signup(signupInfo: AccountSignupRequest): Promise<IUserInfo>;

    login(loginCredentials: LoginCredentials): Promise<IUserInfo>;
}

export class AccountHandler implements IAccountHandler {
    private logger = getLogger('AccountHandler', 'info');

    constructor(private accountRepository: IAccountRepository,
                private userHandler: IUserHandler) {
    }

    async signup(signupInfo: AccountSignupRequest): Promise<IUserInfo> {
        this.logger.info(`Signing up ${signupInfo.username}`);

        let accountId = await this.accountRepository.createAccount(signupInfo);
        let userId = await this.userHandler.createUser({
            id: accountId,
            username: signupInfo.username
        });

        this.logger.info(`Signed up ${signupInfo.username} user id: ${userId}, account id: ${accountId}`);

        return userId;
    }

    async login(loginCredentials: LoginCredentials): Promise<IUserInfo> {
        return new Promise<IUserInfo>((resolve, reject) => {
            (async () => {
                try {
                    let accountInfo = await this.accountRepository.findAccountByUsername(loginCredentials.username);
                    //todo compare passwords

                    let userInfo = await this.userHandler.loadUser(accountInfo.id);
                    resolve(userInfo);
                } catch (e) {
                    reject(e);
                }
            })();
        });
    }

}

