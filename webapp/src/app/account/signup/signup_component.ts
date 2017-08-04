import {accountHttpService} from '../account_http_service';
import {appRouter} from '../../router';
import Vue from 'vue';
import Component from "vue-class-component";
import {IUserId} from "user";

@Component({
    data: () => {
        return {
            errorMsg: '',
            loading: false,
            username: '',
            password: ''
        };
    },
    template: require('./signup_component.tpl.html')
})
export default class SignupComponent extends Vue {
    errorMsg: string = '';
    loading: boolean = false;
    username: string = '';
    password: string = '';

    signup() {
        this.loading = true;
        accountHttpService.signup({
            username: this.username,
            password: this.password
        }).then((userId: IUserId) => {
            this.loading = false;
            appRouter.push({path: `user/${this.username}/courses`, params: {userId: userId.id}});
        }).catch((errorMsg: string) => {
            this.loading = false;
            this.errorMsg = errorMsg;
            console.log(errorMsg);
        });
    }
}
