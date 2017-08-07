import axios from "axios";
import {LoginCredentials, LoginResponse, WebappSignupData} from 'account.d.ts';
import {IUserInfo} from "user";
import {userQueryService} from "./user_query_service";

class AccountHttpService {

    login (loginCredentials: LoginCredentials): Promise<IUserInfo> {
        return axios.post('account/login', loginCredentials)
            .then((value => {
                //todo attach cookie, maintain authentication for future requests
                let userInfo: IUserInfo = <IUserInfo> value.data;
                userQueryService.setCurrentUser(userInfo);
                return <IUserInfo> value.data;
            })).catch((response => {
                throw response.response.data;
            }))
    }

    signup (signupData: WebappSignupData): Promise<IUserInfo> {
        return axios.post('account/signup', signupData).then((value => {
            let userInfo = <IUserInfo> value.data;
            userQueryService.setCurrentUser(userInfo);
            return userInfo;
        }))
            .catch((response => {
                throw response.response.data;
            }));
    }

    getLoggedInUserInfo (): Promise<IUserInfo> {
        return axios.get('account/userInfo')
            .then((value => {
                let userInfo = <IUserInfo> value.data;
                return userInfo;
            }))
            .catch((response) => {
                throw response.response.data;
            });
    }

    logout (): Promise<void> {
        return axios.post('account/logout').then((value => {
            userQueryService.resetCurrentUser();
        })).catch((response => {
            throw response.response.data;
        }));
    }
}

export const accountHttpService = new AccountHttpService();

