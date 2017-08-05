import {Datasource, datasource, IQueryConfig} from "../datasource";
import {LoginCredentials, WebappSignupData} from "account";
import {IUserInfo} from "user";
import {AbstractRepository} from "../repository";

export interface IAccountRepository {
    accountExists(username: string): Promise<boolean>;

    createAccount(signupInfo: WebappSignupData): Promise<string>;

    findAccountByUsername(loginCredentials): Promise<IUserInfo>;
}

class AccountRepository extends AbstractRepository implements IAccountRepository {

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

    async createAccount(signupInfo: WebappSignupData): Promise<string> {
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

                    let userRow = results.rows[0];
                    resolve({
                        id: userRow.id,
                        username: userRow.username,
                        firstName: userRow.firstName,
                        lastName: userRow.lastName,
                        adminOfCourseIds: [],
                        enrolledInCourseIds: [],
                        completedCourseIds: []
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

export const accountRepository = new AccountRepository(datasource);
