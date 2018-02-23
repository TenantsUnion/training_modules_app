<template>
    <div style="justify-content: center;">
        <div class="grid-x align-center">
            <div class="cell small-6">
                <div class="callout float-center">
                    <h1>Signup</h1>
                    <loading v-if="loading"></loading>
                </div>
            </div>
        </div>
        <div class="grid-x align-center">
            <div class="cell small-6">
                <div class="callout float-center">
                    <vue-form :state="formstate" @submit.prevent="signup">
                        <validate>
                            <field-messages name="username"
                                            show="$submitted || $dirty">
                                <small class="error" slot="required">A username is needed to signup for an account
                                </small>
                                <small class="error" slot="pattern">A username may only consist of alphanumeric
                                    characters, '_', or '-'
                                </small>
                            </field-messages>
                            <small class="error" v-if="errorMessages && errorMessages.username">
                                {{errorMessages.username}}
                            </small>
                            <label for="username-signup">Username</label>
                            <input v-model="model.username" type="text"
                                   required
                                   pattern="[A-Za-z\-_0-9]*"
                                   name="username"
                                   placeholder="username"
                                   ref="signup"
                                   id="username-signup"/>
                            <!--<label for="password">Password-->
                            <!--<input v-model="model.password" type="password" id="password"/>-->
                            <!--</label>-->
                            <button @click="signup" type="button" class="signup-submit-btn button">Sign Up</button>
                            <!--<button class="button secondary">Forgot Password</button>-->
                        </validate>
                    </vue-form>
                </div>
            </div>
        </div>
    </div>
</template>
<script src="./signup_component.ts" lang="ts"></script>
