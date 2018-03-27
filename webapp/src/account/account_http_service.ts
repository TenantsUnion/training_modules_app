import _ from "underscore";
import axios from "axios";
import {LoginCredentials, AccountSignupRequest} from '@shared/account';
import {IUserInfo} from "@shared/user";
import {userQueryService} from "./user_query_service";

class AccountHttpService {

    login (loginCredentials: LoginCredentials): Promise<IUserInfo> {
        return axios.post('account/login', loginCredentials)
            .then((value) => {
                //todo attach cookie, maintain authentication for future requests
                let userInfo: IUserInfo = <IUserInfo> value.data;
                userQueryService.setCurrentUser(userInfo);
                return <IUserInfo> value.data;
            }).catch((response => {
                throw response.response.data;
            }))
    }

    signup (signupData: AccountSignupRequest): Promise<IUserInfo> {
        return axios.post('account/signup', signupData).then((value => {
            let userInfo = <IUserInfo> value.data;
            userQueryService.setCurrentUser(userInfo);
            return userInfo;
        }))
            .catch((response => {
                throw response.response.data;
            }));
    }

    async getLoggedInUserInfo (username: string): Promise<IUserInfo> {
        return axios.get(`account/user-info/${username}`)
            .then((value => {
                let userInfo = <IUserInfo> value.data;
                return _.isObject(userInfo) ? userInfo : null; // currently returns empty "200" status if not logged in which becomes data prop
            }))
    }

    logout (): Promise<any> {
        return axios.post('account/logout');
    }
}

export const accountHttpService = new AccountHttpService();

