import {expect} from "chai";
import {clearData} from "../test_db_util";
import {accountRepository} from "../../../../server/src/config/repository_config";
import {AccountInfo} from "../../../../server/src/user/user_handler";
import {postgresDb} from "../../../../server/src/datasource";

describe('Account Repository', function () {

    beforeEach(async function () {
        await clearData();
    });

    it('should create an account', async function () {
        let username = 'user_person';
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
        let username = 'username';
        let accountId = await accountRepository.createAccount({username});
        let account = await accountRepository.findAccountByUsername(username);
        expect(account).to.deep.eq(<AccountInfo>{
            id: accountId
        });
    });
});