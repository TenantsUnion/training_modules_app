import {
    LoginCredentials, AccountSignupRequest,
    AccountSignupFieldErrors, AccountLoginFieldErrors
} from "../../../shared/account";
import {IAccountRepository} from "./account_repository";

export class AccountRequestValidator {
    constructor (private accountRepository: IAccountRepository) {
    }

    async signup (signupInfo: AccountSignupRequest): Promise<null | AccountSignupFieldErrors> {
        return new Promise<null | AccountSignupFieldErrors>((resolve, reject) => {
            if (!signupInfo.username) {
                return resolve({username: 'Need username in order to createAccount'});
            }
            (async () => {
                try {
                    let accountExists = await this.accountRepository.accountExists(signupInfo.username);
                    if (accountExists) {
                        return resolve({
                            username: `Account with username: ${signupInfo.username} already exists`
                        });
                    }

                    resolve(null);
                } catch (e) {
                    reject(e);
                }
            })();
        });
    }

    async login (loginCredentials: LoginCredentials): Promise<null | AccountLoginFieldErrors> {
        return new Promise<null | AccountLoginFieldErrors>((resolve, reject) => {
            if (!loginCredentials.username) {
                resolve({username: `Username required for login`});
            }

            (async () => {
                let exists = await this.accountRepository.accountExists(loginCredentials.username);
                if (!exists) {
                    return resolve({username: `No account found that matches username ${loginCredentials.username}`});
                }

                resolve(null);
            })();
        });
    }
}

