import {accountHttpService} from '../account_http_service';
import {appRouter} from '../../router';
import Vue from 'vue';
import Component from "vue-class-component";
import {IUserId} from "user";
import {AccountFormState} from '../login/login_component';
import {Watch} from 'vue-property-decorator';
import {AccountSignupFieldErrors} from '../../../../../shared/account';

@Component({
    data: () => {
        return {
            loading: false,
            errorMessages: null,
            model: {
                username: '',
                password: ''
            },
            formstate: {}
        };
    },
    template: require('./signup_component.tpl.html')
})
export default class SignupComponent extends Vue {
    errorMessages: AccountSignupFieldErrors = {};
    loading: boolean = false;
    model = {
        username: '',
        password: ''
    };
    formstate: AccountFormState;

    @Watch('model.username')
    resetUsername() {
        this.errorMessages && delete this.errorMessages
    }

    signup() {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }
        this.loading = true;
        this.errorMessages = null;
        accountHttpService.signup({
            username: this.model.username,
            password: this.model.password
        }).then((userId: IUserId) => {
            this.loading = false;
            appRouter.push({path: `user/${this.model.username}/courses`, params: {userId: userId.id}});
        }).catch((errorMessages: AccountSignupFieldErrors) => {
            this.loading = false;
            this.errorMessages = errorMessages;
        });
    }
}
