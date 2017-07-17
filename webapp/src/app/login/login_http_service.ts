import axios, {AxiosPromise} from "axios";
import {LoginCredentials} from 'login';
import {IUserInfo} from '../../../../shared/user';

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

