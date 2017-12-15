import {accountHttpService} from '../account_http_service';
import {appRouter} from '../../router';
import Vue from 'vue';
import Component from "vue-class-component";
import {IUserId} from "user";
import {AccountFormState} from '../login/login_component';
import {Watch} from 'vue-property-decorator';
import {AccountSignupFieldErrors} from '../../../../../shared/account';
import {$} from "../../globals";
import {USER_ACTIONS, USER_MUTATIONS} from '../../courses/store/user/user_store';

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

    async signup() {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }
        this.loading = true;
        this.errorMessages = null;
        try {
            await this.$store.dispatch(USER_ACTIONS.SIGNUP, {username: this.model.username});
            appRouter.push({path: `user/${this.$store.state.user.username}/enrolled-courses`});
        } catch (errorMessages) {
            this.errorMessages = errorMessages;
        } finally {
            this.loading = false;
        }
    }

    mounted() {
        $(this.$refs.signup).focus();
    }
}
