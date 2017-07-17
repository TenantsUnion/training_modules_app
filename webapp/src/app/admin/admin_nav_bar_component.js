import * as _ from 'underscore';
import Vue from 'vue';
export var AdminNavBarProps = {
    username: 'username'
};
var vm = AdminNavBarProps;
export var AdminNavBar = Vue.extend({
    props: _.values(vm),
    created: function () {
        this.username;
    },
    //language=HTML
    template: "\n        <p>Hello {{ " + vm.username + " }} from Admin nav bar</p>\n    "
});
