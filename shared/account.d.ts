import {IUserInfo} from './user';

declare namespace account {
    interface AccountSignupRequest {
        username: string;
        password?: string;
    }

    interface AccountSignupFieldErrors {
        username?: string;
        password?: string;
    }

    interface AccountLoginFieldErrors {
        username?: string;
        password?: string;
    }

    interface LoginCredentials {
        username: string;
        password: string;
    }

    interface LoginResponse {
        userInfo: IUserInfo
    }
}

export = account;

