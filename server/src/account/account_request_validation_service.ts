import {
    LoginCredentials, AccountSignupRequest,
    AccountSignupFieldErrors, AccountLoginFieldErrors
} from "../../../shared/account";
import {IAccountRepository} from "./account_repository";


const usernameRegex = /[a-zA-Z_\-0-9]+/;
export class AccountRequestValidator {
    constructor(private accountRepository: IAccountRepository) {
    }

    async signup(signupInfo: AccountSignupRequest): Promise<null | AccountSignupFieldErrors> {
        if (!usernameRegex.test(signupInfo.username)) {
            return {username: 'username must only contain alphanumeric characters, \'-\', or \'_\''};
        }

        let accountExists = await this.accountRepository.accountExists(signupInfo.username);
        if (accountExists) {
            return {username: `Account with username: ${signupInfo.username} already exists`};
        }
    }

    async login(loginCredentials: LoginCredentials): Promise<null | AccountLoginFieldErrors> {
        if (!loginCredentials.username) {
            return {username: `Username required for login`};
        }

        let exists = await this.accountRepository.accountExists(loginCredentials.username);
        if (!exists) {
            return {username: `No account found that matches username ${loginCredentials.username}`};
        }
    }
}

