import {IUserInfo} from './user';
declare namespace account {
    interface WebappSignupData {
        username: string;
        password: string;
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

