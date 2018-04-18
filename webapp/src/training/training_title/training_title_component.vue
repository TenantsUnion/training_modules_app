<template>
    <training-element focus-field="title">
        <div slot="display">
            <h2>{{training.title}}</h2>
        </div>
        <div slot="edit">
            <vue-form :state="formstate" @submit.prevent>
                <validate>
                    <field-messages name="title" show="$submitted || $dirty">
                        <small class="error" slot="required">
                            A title is needed in order to update the course
                        </small>
                    </field-messages>
                    <label for="course-title">Title
                        <input v-model="editTitle" type="text"
                               name="title"
                               required
                               placeholder="Course Title"
                               id="course-title"/>
                    </label>
                </validate>
            </vue-form>
        </div>
    </training-element>
</template>
<script src="./training_title_component.ts" lang="ts"></script>