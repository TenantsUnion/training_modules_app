import {loginHttpService} from './login_http_service';
import {appRouter} from '../router';
import {IErrorResponse} from 'http_responses';
import Vue from 'vue';
import Component from "vue-class-component";
import {IUserInfo, USER_ROLE} from "user";

@Component({
    data: () => {
        return {
            errorMsg: '',
            loading: false,
            username: '',
            password: ''
        };
    },
    template: require('./login_component.tpl.html')
})
export default class LoginComponent extends Vue {
    errorMsg: string = '';
    loading: boolean = false;
    username: string = '';
    password: string = '';

    login() {
        this.loading = true;
        loginHttpService.login({
            username: this.username,
            password: this.password
        }).then((userInfo:IUserInfo) => {
            let routePath = userInfo.role === USER_ROLE.admin ?
                `admin/${userInfo.username}` : `${userInfo.username}/modules`;
                appRouter.push({path: routePath});

            this.loading = false;
        }).catch((response: IErrorResponse) => {
            this.loading = false;
        });
    }
}
