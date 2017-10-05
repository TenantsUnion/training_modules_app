import {accountHttpService} from '../account_http_service';
import {appRouter} from '../../router';
import Vue from 'vue';
import Component from "vue-class-component";
import {IUserId} from "user";
import * as VueForm from "../../vue-form";
import {FormField} from "../../vue-form";
import {Watch} from "vue-property-decorator";
import {AccountLoginFieldErrors} from "../../../../../shared/account";
import {$} from "../../globals";

export interface AccountFormState extends VueForm.FormState {
    username: FormField;
}

@Component({
    data: () => {
        return {
            loading: false,
            errorMessages: {},
            model: {
                username: '',
                password: ''
            },
            formstate: {},
        };
    },
    template: require('./login_component.tpl.html')
})
export default class LoginComponent extends Vue {
    errorMessages: AccountLoginFieldErrors;
    loading: boolean = false;
    model = {
        username: '',
        password: ''
    };
    formstate: AccountFormState;

    @Watch('model.username')
    resetUsername() {
        this.errorMessages && delete this.errorMessages.username;
    }

    login() {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }
        this.loading = true;
        this.errorMessages = null;
        accountHttpService.login({
            username: this.model.username,
            password: this.model.password
        }).then((userId: IUserId) => {
            appRouter.push({
                path: `user/${this.model.username}/enrolled-courses`,
                params: {userId: userId.id}
            });
            this.loading = false;
        }).catch((errorMessages: AccountLoginFieldErrors) => {
            this.loading = false;
            this.errorMessages = errorMessages;
        });
    }

    mounted() {
        $(this.$refs.login).focus();
    }
}
