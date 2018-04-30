<template>
    <training-element focus-field="description" :cancel-callback="cancelCallback">
        <div slot="display">
            <p v-show="training.description">{{training.description}}</p>
            <p v-if="!training.description && isAdmin" class="subheader">No description</p>
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
                        <textarea v-model="editDescription" type="text"
                                  name="description"
                                  maxlength="300"
                                  placeholder="Description"
                                  id="training-description"/>
                    </label>
                </validate>
            </vue-form>
        </div>
    </training-element>
</template>
<script src="./training_description_component.ts" lang="ts"></script>