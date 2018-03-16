import {expect} from "chai";
import {accountRepository} from "@server/config/repository_config";
import {postgresDb} from "@server/datasource";
import {AccountInfo} from "@server/user/user_handler";
import {appendUUID} from "@testcafe/src/util/uuid_generator";

describe('Account Repository', function () {

    it('should create an account', async function () {
        let username = appendUUID('username');
        let accountId = await accountRepository.createAccount({
            username: username
        });

        let results = await postgresDb.query(`SELECT * FROM tu.account where id = '${accountId}\'`);
        expect(results[0].username).to.eq(username);
    });

    it('should determine false for checking if a nonexistent account exists', async function () {
        expect(await accountRepository.accountExists('user')).to.be.false;
    });

    it('should find an account by username', async function () {
        let username = appendUUID('username');
        let accountId = await accountRepository.createAccount({username});
        let account = await accountRepository.findAccountByUsername(username);
        expect(account).to.deep.eq(<AccountInfo>{
            id: accountId
        });
    });
});