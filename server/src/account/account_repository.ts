import {Datasource, datasource, IQueryConfig} from "../datasource";
import {LoginCredentials, WebappSignupData} from "account";
import {IUserInfo} from "user";

export interface IAccountRepository {
    accountExists(username: string): Promise<boolean>;

    createAccount(signupInfo: WebappSignupData): Promise<void>;

    findAccountByUsername(loginCredentials): Promise<IUserInfo>;
}

class AccountRepository implements IAccountRepository {

    constructor(private datasource: Datasource) {
    }

    async accountExists(username: string): Promise<boolean> {
        console.log('checking account exists from user repository');
        console.log('username: ' + username);
        return new Promise<boolean>((resolve, reject) => {
            if (!username) {
                resolve(false);
                return;
            }

            (async () => {
                try {
                    let result = await datasource.query({
                        text: `SELECT COUNT(*) FROM tu.account WHERE tu.account.username = $1`,
                        values: [username]
                    });
                    resolve(result.rows[0].count !== '0');
                } catch (e) {
                    reject(e);
                }
            })();
        });
    }

    async createAccount(signupInfo: WebappSignupData): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!signupInfo.username) {
                return resolve(null);
            }

            (async () => {
                try {
                    await this.datasource.query({
                        text: `INSERT INTO tu.account (username) VALUES ($1)`,
                        values: [signupInfo.username]
                    });
                    resolve();
                } catch (e) {
                    console.log("Database error");
                    console.log(e);
                    console.log(e.stack);
                    reject(e);
                }
            })();
        });
    }

    async findAccountByUsername(username: string): Promise<IUserInfo> {
        return new Promise<IUserInfo>((resolve, reject) => {
            if (!username) {
                return resolve(null);
            }

            (async () => {
                try {
                    let results = await datasource.query({
                            text: `SELECT * FROM tu.account a WHERE a.username = $1`,
                            values: [username]
                        }
                    );
                    resolve(results.rows[0]);
                } catch (e) {
                    console.log("Database findAccountByUsername error");
                    console.log(e);
                    console.log(e.stack);
                    reject(e);
                }
            })();
        });
    }
}

export const accountRepository = new AccountRepository(datasource);
