<template>
    <training-element focus-field="title" :cancel-callback="cancelCallback">
        <h2 slot="display">{{title}}</h2>
        <vue-form slot="edit" :state="formstate" @submit.prevent>
            <validate>
                <field-messages name="title" show="$submitted || $dirty">
                    <small class="error" slot="required">
                        A title is needed in order to update the course
                    </small>
                </field-messages>
                <label for="course-title">Title
                    <input v-model=title type="text"
                           name="title"
                           required
                           placeholder="Course Title"
                           id="course-title"/>
                </label>
            </validate>
        </vue-form>
    </training-element>
</template>
<script src="./training_title_component.ts" lang="ts"></script>