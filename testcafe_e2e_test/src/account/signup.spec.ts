import {Selector} from 'testcafe';
import {LandingPageDriver} from "../util/drivers/pages/landing_page_driver";
import {appendUUID} from "@test-shared/uuid_generator";
const config = require("config");

fixture('Account Signup')
    .page(`localhost:${config.get('webapp.port')}`);

test('Navigate to the account screen and signup with username test_admin', async (t) => {
    let username = appendUUID('test_admin');
    let page = new LandingPageDriver();
    await page.signup(username)
        .expect(Selector('.welcome-message').innerText).eql(`Welcome, ${username}!`)
});
