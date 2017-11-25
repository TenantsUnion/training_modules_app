import {IUserInfo} from './user';

export interface AccountSignupRequest {
    username: string;
    password?: string;
}

export interface SignupData {
    username: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}

export interface AccountSignupFieldErrors {
    username?: string;
    password?: string;
}

export interface AccountLoginFieldErrors {
    username?: string;
    password?: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    userInfo: IUserInfo
}

