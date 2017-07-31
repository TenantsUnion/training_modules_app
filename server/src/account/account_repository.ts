import {Datasource, datasource} from "../datasource";
import {WebappSignupData} from "../../../shared/account";

export interface IAccountRepository {
    accountExists(username: string): boolean;

    signup(signupInfo: WebappSignupData): any;

    login(loginCredentials): any;
}

class AccountRepository implements IAccountRepository {

    constructor(private datasource: Datasource) {
    }

    accountExists(username: string): boolean {
        // language=PostgreSQL
        datasource.query(`SELECT COUNT(*) from tu.accout`)
        return false;
    }

    signup(signupInfo: WebappSignupData) {

    }

    login(loginCredentials: any) {
        throw new Error("Method not implemented.");
    }

}

export const accountRepository = new AccountRepository(datasource);
