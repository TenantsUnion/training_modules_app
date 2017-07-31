import {LoginCredentials, WebappSignupData} from "account.d.ts";
import {IAccountRepository} from "./account_repository";

export interface IAccountHandler {
    signup(signupInfo: WebappSignupData): any;

    login(loginCredentials: LoginCredentials): any;
}

export class AccountHandler implements IAccountHandler {
    constructor(private accountRepository: IAccountRepository) {
    }

    signup(signupInfo: WebappSignupData){
        this.accountRepository
    }

    login(loginCredentials: LoginCredentials) {

    }


}