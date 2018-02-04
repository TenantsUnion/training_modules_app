<template>
    <div class="main">
        <div class="row">
            <div class="small-12 large-10">
                <h1>Create Section</h1>
                <loading v-if="loading"></loading>
            </div>
        </div>
        <vue-form :state="formstate" @submit.prevent="createSection">
            <validate>
                <div class="row">
                    <div class="columns small-12 large-10">
                        <field-messages name="title"
                                        show="$submitted || $dirty">
                            <small class="error" slot="required">
                                A title is need to create a section
                            </small>
                        </field-messages>
                        <small class="error"
                               v-if="errorMessages && errorMessages.title">
                            {{errorMessages.title}}
                        </small>
                        <div>
                            <label for="section-title">Title
                                <input v-model="title" type="text"
                                       name="title"
                                       required
                                       placeholder="Section Title"
                                       id="section-title"/>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="columns small-12 large-10">
                        <time-estimate :is-input="true"
                                       :time-estimate="timeEstimate"
                                       :updated="timeEstimateUpdated"/>
                    </div>
                </div>
                <div class="row">
                    <div class="columns small-12 large-10">
                        <label for="section-description">Description</label>
                        <textarea v-model="description" type="text"
                                  placeholder="Section description"
                                  id="section-description"></textarea>
                    </div>
                </div>
                <div class="row">
                    <div class="small-12 large-10 columns">
                        <training-segments :stored-segments="quillContent" ref="trainingSegment"></training-segments>
                    </div>
                </div>
                <div class="row">
                    <div class="columns small-12 large-10">
                        <add-content-component :callback="addContentCallback"></add-content-component>
                    </div>
                </div>
            </validate>
            <div class="row">
                <div class="columns small-2">
                    <button @click="createSection" class="button" type="button">
                        Create
                    </button>
                </div>
            </div>
        </vue-form>
    </div>
</template>
<script lang="ts" src="./create_section_component.ts"></script>
