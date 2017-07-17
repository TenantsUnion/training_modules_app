import axios from "axios";
var LoginHttpService = (function () {
    function LoginHttpService() {
    }
    LoginHttpService.prototype.login = function (loginCredentials) {
        return axios.post('login', loginCredentials).then((function (value) {
            //todo attach cookie, maintain authentication for future requests
            return value.data;
        }));
    };
    return LoginHttpService;
}());
export var loginHttpService = new LoginHttpService();
