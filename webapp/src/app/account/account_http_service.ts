import axios from "axios";
import {LoginCredentials, LoginResponse, WebappSignupData} from 'account.d.ts';
import {IUserInfo} from "user";

class AccountHttpService {

    login(loginCredentials: LoginCredentials): Promise<IUserInfo> {
        return axios.post('account/login', loginCredentials)
            .then((value => {
                //todo attach cookie, maintain authentication for future requests
                return <IUserInfo> value.data;
            })).catch((response => {
                throw response.response.data;
            }))
    }

    signup(signupData: WebappSignupData): Promise<IUserInfo> {
        return axios.post('account/signup', signupData).then((value => {
            return <IUserInfo> value.data;
        }))
            .catch((response => {
                throw response.response.data;
            }));
    }
}

export const accountHttpService = new AccountHttpService();

