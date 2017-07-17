import LoginComponent from './login_component.vue';
export var loginRoutes = [
    {
        path: '/login',
        name: 'login',
        component: {
            components: {
                'login-component': LoginComponent
            },
            //language=HTML
            template: "\n                <login-component></login-component>\n            "
        },
    }
];
