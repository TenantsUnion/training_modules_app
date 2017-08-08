import {accountHttpService} from '../account_http_service';
import {appRouter} from '../../router';
import {IErrorResponse} from 'http_responses';
import Vue, {WatchHandler} from 'vue';
import Component from "vue-class-component";
import {IUserId, IUserInfo} from "user";
import * as VueForm from "../../vue-form";
import {FormField} from "../../vue-form";
import {Watch} from "vue-property-decorator";

interface LoginFormState extends VueForm.FormState {
    username: FormField;
}

@Component({
    data: () => {
        return {
            formstate: {},
            model: {
                username: '',
                password: ''
            },
            errorMsg: '',
            loading: false,
        };
    },
    template: require('./login_component.tpl.html')
})
export default class LoginComponent extends Vue {
    errorMessages: {[index:string]:string} = {};
    loading: boolean = false;
    model = {
        username: '',
        password: ''
    };
    formstate: LoginFormState;

    @Watch('model.username')
    resetUsername() {
        delete this.errorMessages.username;
    }

    login () {
        this.formstate.$submitted = true;
        if (this.formstate.$invalid) {
            return;
        }
        this.loading = true;
        accountHttpService.login({
            username: this.model.username,
            password: this.model.password
        }).then((userId: IUserId) => {
            appRouter.push({
                path: `user/${this.model.username}/courses`,
                params: {userId: userId.id}
            });
            this.loading = false;
        }).catch((errorMsg: string) => {
            this.loading = false;
            this.errorMessages = {username: errorMsg};
        });
    }
}
