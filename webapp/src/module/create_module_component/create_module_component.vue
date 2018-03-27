<template>
    <div class="main">
        <div class="grid-x">
            <div class="small-12 large-10 cell">
                <h1>Create Module</h1>
                <loading v-if="loading"/>
            </div>
        </div>
        <vue-form :state="formstate" @submit.prevent="createModule">
            <validate>
                <div class="grid-x">
                    <div class="cell small-12 large-10">
                        <field-messages name="title"
                                        show="$submitted || $dirty">
                            <small class="error" slot="required">
                                A title is need to create a module
                            </small>
                        </field-messages>
                        <small class="error"
                               v-if="errorMessages && errorMessages.title">
                            {{errorMessages.title}}
                        </small>
                        <div>
                            <label for="module-title">Title
                                <input v-model="title" type="text"
                                       name="title"
                                       required
                                       placeholder="Module Title"
                                       id="module-title"/>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="grid-x">
                    <div class="cell small-12 large-10">
                        <time-estimate :is-input="true" :time-estimate="timeEstimate" :updated="timeEstimateUpdated"/>
                    </div>
                </div>
                <div class="grid-x">
                    <div class="cell small-12 large-10">
                        <label for="module-description">Description</label>
                        <textarea v-model="description" type="text"
                                  placeholder="Course description"
                                  id="module-description"></textarea>
                    </div>
                </div>
            </validate>
            <div class="grid-x">
                <div class="cell small-2">
                    <button @click="createModule" class="button" type="button">Create</button>
                </div>
            </div>
        </vue-form>
    </div>
</template>
<script lang="ts" src="./create_module_component.ts"></script>
