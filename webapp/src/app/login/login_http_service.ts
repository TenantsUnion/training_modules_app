import axios from "axios";
import {LoginCredentials, LoginResponse} from 'account.d.ts';
import {IUserInfo} from "user";

class LoginHttpService {

    login(loginCredentials:LoginCredentials): Promise<IUserInfo> {
        return axios.post('login', loginCredentials).then((value => {
            //todo attach cookie, maintain authentication for future requests
            return <IUserInfo> value.data;
        }))
    }
}

export interface ILoginHttpService {
    login: (loginCredentials:LoginCredentials) => void;
}

export const loginHttpService = new LoginHttpService();

