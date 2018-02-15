import {Selector} from 'testcafe';
import {clearData} from "@mochatest/src/test_db_util";
import {LandingPageDriver} from "../util/drivers/pages/landing_page_driver";
import {config} from "@shared/normalize_imports";

fixture('Account Signup')
    .page(`localhost:${config.get('webapp.port')}`)
    .before(async () => {
        await clearData();
    });

test('Navigate to the account screen and signup with username test_admin', async (t) => {
    let username = 'test_admin';
    let page = new LandingPageDriver();
    await page.signup(username)
        .expect(Selector('.welcome-message').innerText).eql(`Welcome, ${username}!`)
});
