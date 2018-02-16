import {appRouter} from '../../router';
import Vue from 'vue';
import Component from "vue-class-component";
import {Watch} from 'vue-property-decorator';
import {AccountSignupFieldErrors} from '@shared/account';
import {$} from "../../globals";
import {USER_ACTIONS} from '../../user/store/user_store';
import {AccountFormState} from "../account_routes";

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
