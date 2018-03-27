<template>
    <div>
        <div class="cell small-2">
            <div class="grid-x align-center">
                <div class="small-8 cell">
                    <div>
                        <h2>Edit Content
                            <loading v-if="loading"></loading>
                        </h2>
                        <p v-if="errorMessages">{{ errorMessages }}</p>
                    </div>
                </div>
            </div>
        </div>
        <vue-form :state="formstate" @submit.prevent="onSubmit">
            <div class="cell small-2">
                <div class="grid-x align-center">
                    <div class="small-8 cell">
                        <validate>
                            <label for="content-title">Title*</label>
                            <field-messages name="title"
                                            show="$submitted || $dirty">
                                <small class="error" slot="required">
                                    Content must have a title
                                </small>
                            </field-messages>
                            <input v-model="title" type="text"
                                   required
                                   name="title"
                                   placeholder="Content Title"
                                   id="content-title"/>
                        </validate>
                    </div>
                </div>
            </div>
            <div class="cell small-6">
                <div class="grid-x align-center">
                    <div class="small-8 cell">
                        <label>Content*</label>
                        <quill-editor id="edit-content" :editor-json="content.quillData" ref="editor"></quill-editor>
                    </div>
                </div>
            </div>

            <div class="cell small-2">
                <div class="grid-x align-center">
                    <div class="small-8 cell">
                        <button @click="save" type="button"
                                class="button primary" :disabled="loading">
                            Save
                        </button>
                        <button @click="save" type="button"
                                class="button primary" :disabled="loading">
                            Done
                        </button>
                        <button @click="cancel" type="button"
                                class="button secondary" :disabled="loading">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </vue-form>
    </div>
</template>
<script lang="ts" src="./edit_user_content_component.ts"></script>
