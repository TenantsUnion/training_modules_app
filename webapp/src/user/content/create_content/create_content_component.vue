<template>
    <div class="user-main">
        <div class="grid-x">
            <div class="small-8 cell">
                <div>
                    <h2>Create Content</h2>
                    <loading v-if="loading"></loading>
                </div>
            </div>
        </div>
        <div class="grid-x">
            <div class="small-8 cell">
                <vue-form :state="formstate" @submit.prevent="create">
                    <validate>
                        <div class="grid-x">
                            <field-messages name="title"
                                            show="$submitted || $dirty">
                                <small class="error" slot="required">
                                    A title is needed to create content
                                </small>
                            </field-messages>

                            <div class="small-8 cell">
                                <label for="content-title">Title
                                    <input v-model="title" type="text"
                                           required
                                           placeholder="Content Title"
                                           id="content-title"/>
                                </label>
                            </div>
                        </div>
                        <div class="grid-x">
                            <div class="small-8 cell">
                                <label>Content</label>
                                <quill-editor ref="editor"></quill-editor>
                            </div>
                        </div>
                    </validate>
                    <div class="grid-x">
                        <div class="small-8 cell">
                            <button @click="create" class="button primary" :disabled="loading">Create</button>
                            <button @click="cancel" type="button"
                                    class="button secondary" :disabled="loading">
                                Cancel
                            </button>
                        </div>
                    </div>
                </vue-form>
            </div>
        </div>
    </div>
</template>
<script lang="ts" src="./create_content_component.ts"></script>
