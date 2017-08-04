import {accountHttpService} from '../account_http_service';
import {appRouter} from '../../router';
import {IErrorResponse} from 'http_responses';
import Vue from 'vue';
import Component from "vue-class-component";
import {IUserId, IUserInfo} from "user";

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
        accountHttpService.login({
            username: this.username,
            password: this.password
        }).then((userId: IUserId) => {
            appRouter.push({path: `user/${this.username}/courses`, params: {userId: userId.id}});
            this.loading = false;
        }).catch((errorMsg: string) => {
            this.loading = false;
            this.errorMsg = errorMsg;
            console.log(errorMsg);
        });
    }
}
