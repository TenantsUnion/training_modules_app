import {IUserInfo} from './user';
declare namespace login {
    interface LoginCredentials {
        username: string;
        password: string;
    }

    interface LoginResponse {
        userInfo: IUserInfo
    }
}

export = login;

