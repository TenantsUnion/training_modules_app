<template>

    <div class="main">
        <div class="grid-x">
            <div class="cell small-12 large-10">
                <h1>Edit Module</h1>
                <loading v-if="loading || saving"/>
            </div>
        </div>
        <template v-if="module">
            <vue-form :state="formstate" @submit.prevent="saveModule">
                <validate>
                    <small class="error" v-if="errorMessages">
                        {{errorMessages}}
                    </small>
                </validate>
                <validate>
                    <div class="grid-x">
                        <div class="cell small-8">
                            <field-messages name="title"
                                            show="$submitted || $dirty">
                                <small class="error" slot="required">
                                    A title is need to create a module
                                </small>
                            </field-messages>
                            <div>
                                <label for="module-title">Title
                                    <input v-model="module.title" type="text"
                                           name="title"
                                           required
                                           placeholder="Module Title"
                                           id="module-title"/>
                                </label>
                            </div>
                        </div>
                    </div>
                </validate>
                <validate>
                    <div class="grid-x">
                        <div class="cell small-12 large-10">
                            <time-estimate :is-input="true"
                                           :time-estimate="module.timeEstimate"
                                           :updated="timeEstimateUpdated"/>
                        </div>
                    </div>
                </validate>
                <validate>
                    <div class="grid-x">
                        <div class="cell small-12 large-10">
                            <label for="module-description">Description</label>
                            <textarea v-model="module.description" type="text"
                                      placeholder="Course description"
                                      id="module-description"></textarea>
                        </div>
                    </div>
                </validate>
                <div class="grid-x">
                    <div class="cell small-2">
                        <h3>Sections</h3>
                    </div>
                    <div class="cell small-2">
                        <button class="button" v-on:click="addSection">
                            Add Section
                        </button>
                    </div>
                </div>

                <div class="grid-x">
                    <draggable v-model="sections" element="div" class="cell small-12 large-10">
                        <div v-for="section in sections">
                            <h4 v-bind:style="sectionTitleStyles(section)">
                                {{section.title}}
                                <button v-if="!removeSections[section.id]"
                                        v-on:click="removeSection(section)"
                                        title="Remove Section" type="button" class="button alert button__icon">
                                    <i class="fa fa-minus fa-fw" aria-hidden="true"></i>
                                    <span class="sr-only">Remove Section</span>
                                </button>
                                <button v-if="removeSections[section.id]"
                                        v-on:click="cancelRemoveSection(section)"
                                        title="Cancel Remove Section" type="button"
                                        class="button secondary button__icon">
                                    <i class="fa fa-times fa-fw" aria-hidden="true"></i>
                                    <span class="sr-only">Cancel Remove Section</span>
                                </button>
                            </h4>
                            <p>{{section.description}}</p>
                        </div>
                    </draggable>
                </div>
                <div class="grid-x">
                    <div class="cell small-12 large-10">
                        <edit-training-segments :content-questions="module.contentQuestions" ref="trainingSegment"/>
                    </div>
                </div>
                <div class="grid-x">
                    <div class="cell small-2">
                        <button @click="saveModule" class="button" type="button">
                            Save
                        </button>
                    </div>
                </div>
            </vue-form>
        </template>
    </div>
</template>
<script lang="ts" src="./edit_module_component.ts"></script>
