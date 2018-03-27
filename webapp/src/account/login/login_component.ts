import Vue from 'vue';
import Component from "vue-class-component";
import {Watch} from "vue-property-decorator";
import {AccountLoginFieldErrors} from "@shared/account";
import {USER_ACTIONS} from '../../user/store/user_store';
import {RawLocation} from "vue-router";
import {AccountFormState} from "../account_routes";

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
    template: require('./login_component.vue')
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
    resetUsername () {
        this.errorMessages && delete this.errorMessages.username;
    }

    async login () {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }
        this.loading = true;
        this.errorMessages = null;
        try {

            await this.$store.dispatch(USER_ACTIONS.LOGIN, {username: this.model.username});
            this.loading = false;
            if (this.$store.state.user.loggedIn) {
                this.$router.push(<RawLocation>{
                    path: `user/${this.model.username}/enrolled-courses`,
                    params: {userId: this.$store.state.user.userId}
                });
            }
        } catch (errorMessages) {
            this.loading = false;
            this.errorMessages = errorMessages;
        }
    }

    mounted () {
        $(this.$refs.login).focus();
    }
}
