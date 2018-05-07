<template>
    <training-element focus-field="description" :cancel-callback="cancelCallback" :has-edits="hasEdits">
        <div slot="display">
            <p v-show="description">{{description}}</p>
            <p v-if="!description && isAdmin" class="subheader">No description</p>
        </div>
        <div slot="edit">
            <vue-form :state="formstate" @submit.prevent>
                <validate>
                    <field-messages name="title" show="$submitted || $dirty">
                        <small class="error" slot="maxlength">
                            The description length must be 300 characters or less
                        </small>
                    </field-messages>
                    <label for="training-description">Description
                        <textarea v-model="description" type="text"
                                  name="description"
                                  maxlength="300"
                                  placeholder="Training description"
                                  id="training-description"/>
                    </label>
                </validate>
            </vue-form>
        </div>
    </training-element>
</template>
<script src="./training_description_component.ts" lang="ts"></script>