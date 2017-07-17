"use strict";
// import {loginHttpService} from './login_http_service';
// import * as Vue from 'vue';
// import Component from 'vue-class-component';
// import {IErrorResponse} from 'http_responses';
//
// @Component({
//     //language=HTML
//     template: `
//         <div>
//             <p v-if="loading">Logging in...</p>
//             <p v-if="errorMsg">{{ errorMsg }}</p>
//             <div>
//                 <ul>
//                     <li>
//                         <span>username: <input v-model="username" type="text"/></span>
//                     </li>
//                     <li>
//                         <span>password: <input v-model="password" type="password"/></span>
//                     </li>
//                     <li>
//                         <button @click="login">login</button>
//                     </li>
//                 </ul>
//             </div>
//         </div>
//     `
// })
// export default class LoginComponent extends Vue {
//     errorMsg: string;
//     loading: boolean = false;
//     username: string;
//     password: string;
//
//     login() {
//         this.loading = true;
//         loginHttpService.login({
//             username: this.username,
//             password: this.password
//         }).then(() => {
//             this.loading = false;
//         }).catch((response:IErrorResponse) => {
//             this.loading =  false;
//             this.errorMsg = response.message;
//         });
//     }
// }
