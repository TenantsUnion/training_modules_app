<template>
    <div style="justify-content: center;">
        <div class="row align-center">
            <div class="columns small-6">
                <div class="callout float-center">
                    <h1>Login</h1>
                    <p>Please enter your username
                        <loading v-if="loading"></loading>
                    </p>
                </div>
            </div>
        </div>
        <div class="row align-center">
            <div class="columns small-6">
                <div class="callout float-center">
                    <vue-form :state="formstate" @submit.prevent="login">
                        <validate>
                            <field-messages name="username"
                                            show="$submitted || $dirty">
                                <small class="error" slot="required">A username is required to
                                    login
                                </small>
                            </field-messages>
                            <small class="error" v-if="errorMessages && errorMessages.username">
                                {{errorMessages.username}}
                            </small>
                            <label for="username-login">Username</label>
                            <input v-model="model.username"
                                   type="text"
                                   ref="login"
                                   name="username"
                                   required
                                   placeholder="username"
                                   id="username-login"/>
                            <!--<label for="password">Password-->
                            <!--<input v-model="password" type="password" id="password"/>-->
                            <!--</label>-->
                        </validate>
                        <button @click="login" type="button" class="login-submit-btn button">
                            Login
                        </button>
                        <!--<button class="button secondary">Forgot Password</button>-->
                    </vue-form>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" src="./login_component.ts"></script>
