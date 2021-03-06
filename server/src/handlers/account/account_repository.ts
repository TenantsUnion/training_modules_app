import {Datasource} from "../../datasource";
import {AccountSignupRequest} from "../../../../shared/account";
import {AbstractRepository, getUTCNow} from "../../repository";
import {AccountInfo} from "../user/user_handler";
import {getLogger} from '../../log';

export interface IAccountRepository {
    accountExists(username: string): Promise<boolean>;

    createAccount(signupInfo: AccountSignupRequest): Promise<string>;

    findAccountByUsername(loginCredentials): Promise<AccountInfo>;
}

export class AccountRepository extends AbstractRepository implements IAccountRepository {
    logger = getLogger('Account Repository');

    constructor(private datasource: Datasource) {
        super('account_id', datasource);
    }

    async accountExists(username: string): Promise<boolean> {
        if (!username) {
            return false;
        }

        let result = await this.datasource.query({
            text: `SELECT COUNT(*) FROM tu.account a WHERE a.username = $1`,
            values: [username]
        });
        return result[0].count !== '0';
    }

    async createAccount(signupInfo: AccountSignupRequest): Promise<string> {
        let accountId = await this.getNextId();
        await this.datasource.query({
            text: `INSERT INTO tu.account (id, username, created_at, last_active_at) VALUES ($1, $2, $3, $3)`,
            values: [accountId, signupInfo.username, getUTCNow()]
        });
        this.logger.info(`Inserted account id: ${accountId} for username: ${signupInfo.username}`);
        return accountId;
    }

    async findAccountByUsername(username: string): Promise<AccountInfo> {
        let results = await this.datasource.query({
                text: `SELECT * FROM tu.account a WHERE a.username = $1`,
                values: [username]
            }
        );

        let userRow = results[0];
        return {
            id: userRow.id,
        };
    }
}
