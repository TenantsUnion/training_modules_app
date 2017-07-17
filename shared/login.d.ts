import {IUserInfo} from './user';
import {Request, Response} from 'express';
declare namespace login {
    interface LoginCredentials {
        username: string;
        password: string;
    }

    interface LoginResponseBody {
        loginSuccessful: boolean;
        message?: string;
        userInfo?: IUserInfo
    }
}

export = login;

