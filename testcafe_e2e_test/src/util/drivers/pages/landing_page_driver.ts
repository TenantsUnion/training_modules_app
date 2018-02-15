import {Selector, t} from 'testcafe';

export class LandingPageDriver {
    private loginNav = Selector('.login-nav');
    private loginUsernameInput = Selector('#username-login');
    private loginSubmitBtn = Selector('.login-submit-btn');
    private signupNav = Selector('.signup-nav');
    private signupUsernameInput = Selector('#username-signup');
    private signupSubmitBtn = Selector('.signup-submit-btn');

    navigateToLogin (): TestControllerPromise {
        return t.click(this.loginNav);
    }

    navigateToSignup (): TestControllerPromise {
        return t.click(this.signupNav);
    }

    signup (username: string): TestControllerPromise {
        return this.navigateToSignup()
            .typeText(this.signupUsernameInput, username)
            .click(this.signupSubmitBtn);
    }

    login (username: string): TestControllerPromise {
        return this.navigateToLogin()
            .typeText(this.loginUsernameInput, username)
            .click(this.loginSubmitBtn)
    }
}