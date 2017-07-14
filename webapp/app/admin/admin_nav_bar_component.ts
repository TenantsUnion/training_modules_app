import * as Vue from 'vue';
import * as _ from 'underscore';

export interface IAdminNavBarVM {
    username: string;
}

export const AdminNavBarProps: IAdminNavBarVM = {
    username: 'username'
};

let vm = AdminNavBarProps;
export const AdminNavBar = Vue.extend({
    props: _.values(vm),
    created: function (this: IAdminNavBarVM & Vue) {
        this.username;
        console.log('admin nav bar created' + this.username);
    },
    //language=HTML
    template: `
        <p>Hello {{ ${vm.username} }} from Admin nav bar</p>
    `
});