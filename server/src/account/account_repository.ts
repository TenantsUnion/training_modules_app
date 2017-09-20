import {Datasource} from "../datasource";
import {AccountSignupRequest} from "account";
import {AbstractRepository} from "../repository";
import {AccountInfo} from "../user/user_handler";

export interface IAccountRepository {
    accountExists(username: string): Promise<boolean>;

    createAccount(signupInfo: AccountSignupRequest): Promise<string>;

    findAccountByUsername(loginCredentials): Promise<AccountInfo>;
}

export class AccountRepository extends AbstractRepository implements IAccountRepository {

    constructor(private datasource: Datasource) {
        super('account_id_seq', datasource);
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
                    let result = await this.datasource.query({
                        text: `SELECT COUNT(*) FROM tu.account WHERE tu.account.username = $1`,
                        values: [username]
                    });
                    resolve(result[0].count !== '0');
                } catch (e) {
                    reject(e);
                }
            })();
        });
    }

    async createAccount(signupInfo: AccountSignupRequest): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!signupInfo.username) {
                return resolve(null);
            }

            (async () => {
                try {
                    let accountId = await this.getNextId();
                    await this.datasource.query({
                        text: `INSERT INTO tu.account (id, username) VALUES ($1, $2)`,
                        values: [accountId, signupInfo.username]
                    });
                    resolve(accountId);
                } catch (e) {
                    console.log("Database error");
                    console.log(e);
                    console.log(e.stack);
                    reject(e);
                }
            })();
        });
    }

    async findAccountByUsername(username: string): Promise<AccountInfo> {
        return new Promise<AccountInfo>((resolve, reject) => {
            if (!username) {
                return reject(null);
            }

            (async () => {
                try {
                    let results = await this.datasource.query({
                            text: `SELECT * FROM tu.account a WHERE a.username = $1`,
                            values: [username]
                        }
                    );

                    let userRow = results[0];
                    resolve({
                        id: userRow.id,
                    });
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
