import {LoginCredentials, WebappSignupData} from "../../../shared/account";
import {accountRepository, IAccountRepository} from "./account_repository";

export class AccountRequestValidator {
    constructor (private accountRepository: IAccountRepository) {
    }

    async signup (signupInfo: WebappSignupData): Promise<null | string> {
        return new Promise<null | string>((resolve, reject) => {
            if (!signupInfo.username) {
                return resolve('Need username in order to createAccount');
            }
            (async () => {
                try {
                    let accountExists = await this.accountRepository.accountExists(signupInfo.username);
                    if (accountExists) {
                        return resolve(`Account with username: ${signupInfo.username} already exists`);
                    }

                    resolve(null);
                } catch (e) {
                    reject(e);
                }
            })();
        });
    }

    async login (loginCredentials: LoginCredentials): Promise<null | string> {
        return new Promise<null | string>((resolve, reject) => {
            if (!loginCredentials.username) {
                resolve(`Username required for login`);
            }

            (async () => {
                let exists = await this.accountRepository.accountExists(loginCredentials.username);
                if (!exists) {
                    return resolve(`No account found that matches username ${loginCredentials.username}`);
                }

                resolve(null);
            })();
        });
    }
}

export const accountRequestValidator = new AccountRequestValidator(accountRepository);