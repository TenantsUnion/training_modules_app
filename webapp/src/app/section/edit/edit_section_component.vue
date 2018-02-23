<template>
    <div class="main">
        <div class="grid-x">
            <div class="cell small-12 large-10">
                <h1>Edit Section</h1>
                <loading v-if="loading || saving"/>
            </div>
        </div>
        <template v-if="section">
            <vue-form :state="formstate" @submit.prevent="saveSection">
                <validate>
                    <small class="error" v-if="errorMessages">
                        {{errorMessages}}
                    </small>
                </validate>
                <validate>
                    <div class="grid-x">
                        <div class="cell small-12 large-10">
                            <field-messages name="title" show="$submitted || $dirty">
                                <small class="error" slot="required">
                                    A title is need to create a section
                                </small>
                            </field-messages>
                            <label for="section-title">Title
                                <input v-model="section.title" type="text"
                                       name="title"
                                       required
                                       placeholder="Section Title"
                                       id="section-title"/>
                            </label>
                        </div>
                    </div>
                </validate>
                <validate>
                    <div class="grid-x">
                        <div class="cell small-12 large-10">
                            <time-estimate :isInput="true"
                                           :timeEstimate="section.timeEstimate"
                                           :updated="timeEstimateUpdated"/>
                        </div>
                    </div>
                </validate>
                <validate>
                    <div class="grid-x">
                        <div class="cell small-12 large-10">
                            <label for="section-description">Description</label>
                            <textarea v-model="section.description" type="text"
                                      name="description"
                                      placeholder="Section description"
                                      id="section-description"></textarea>
                        </div>
                    </div>
                </validate>
                <div class="grid-x">
                    <div class="small-12 large-10 cell">
                        <edit-training-segments :content-questions="section.contentQuestions" ref="trainingSegment"/>
                    </div>
                </div>
                <div class="grid-x">
                    <div class="cell small-2">
                        <button v-bind:disabled="saving || loading" @click="saveSection" class="button" type="button">
                            Save
                        </button>
                    </div>
                </div>
            </vue-form>
        </template>
    </div>
</template>
<script lang="ts" src="./edit_section_component.ts"></script>
