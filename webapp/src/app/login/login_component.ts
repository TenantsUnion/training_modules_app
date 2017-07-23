import {loginHttpService} from './login_http_service';
import {appRouter} from '../router';
import {IErrorResponse} from 'http_responses';
import Vue from 'vue';
import Component from "vue-class-component";
import {IUserInfo, USER_ROLE} from "../../../../shared/user";

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

    // //language=HTML
    // template: `
    //     <div>
    //         <p v-if="loading">Logging in...</p>
    //         <p v-if="errorMsg">{{ errorMsg }}</p>
    //         <div>
    //             <ul>
    //                 <li>
    //                     <span>username: <input v-model="username" type="text"/></span>
    //                 </li>
    //                 <li>
    //                     <span>password: <input v-model="password" type="password"/></span>
    //                 </li>
    //                 <li>
    //                     <button @click="login">login</button>
    //                 </li>
    //             </ul>
    //         </div>
    //     </div>
    // `
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
            if(userInfo.role === USER_ROLE.admin) {
                appRouter.push({path: 'admin/user'})
            }
            this.loading = false;
        }).catch((response: IErrorResponse) => {
            this.loading = false;
        });
    }
}
