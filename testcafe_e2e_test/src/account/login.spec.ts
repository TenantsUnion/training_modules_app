import {clearData} from "@mochatest/src/test_db_util";
import {LandingPageDriver} from "../util/drivers/pages/landing_page_driver";
import {Selector} from "testcafe";
import {landingPage} from "../util/uri_utils";
import {LoggedInNavigationDriver} from "../util/drivers/pages/logged_in_navigation_driver";

const username = 'test_admin';
fixture(`Account Login`)
    .page(landingPage)
    .before(async () => {
        await clearData();
    })
    .beforeEach(async () => {
        await new LandingPageDriver().signup(username);
        await new LoggedInNavigationDriver().logout();
    });

test.page(landingPage)('Should login as test_admin', async (t) => {
    debugger;
    await new LandingPageDriver().login(username)
        .expect(Selector('.welcome-message').innerText).eql(`Welcome, ${username}!`);
});
