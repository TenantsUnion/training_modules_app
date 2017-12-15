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
import {USER_COURSES_LISTING_ACTIONS} from '../../courses/store/courses_listing/courses_listing_store';
import {USER_ACTIONS} from '../../courses/store/user/user_store';

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

    async login() {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }
        this.loading = true;
        this.errorMessages = null;
        try {


            await this.$store.dispatch(USER_ACTIONS.LOGIN, {username: this.model.username});
            this.loading = false;
            appRouter.push({
                path: `user/${this.model.username}/enrolled-courses`,
                params: {userId: this.$store.state.user.userId}
            });
        } catch (errorMessages) {
            this.loading = false;
            this.errorMessages = errorMessages;
        }
    }

    mounted() {
        $(this.$refs.login).focus();
    }
}
