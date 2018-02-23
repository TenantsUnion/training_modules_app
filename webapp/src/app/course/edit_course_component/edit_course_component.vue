<template>
    <div class="main">
        <div class="grid-x">
            <div class="cell small-12 large-10">
                <div class="callout float-center">
                    <h1>Edit Course</h1>
                    <loading v-if="loading || saving"/>
                </div>
            </div>
        </div>
        <template v-if="course">
            <vue-form :state="formstate" @submit.prevent="save">
                <div class="grid-x">
                    <div class="cell small-12 large-10">
                        <small class="error" v-if="errorMessages">
                            {{errorMessages}}
                        </small>
                    </div>
                </div>
                <validate>
                    <div class="grid-x">
                        <div class="cell small-12 large-10">
                            <field-messages name="title" show="$submitted || $dirty">
                                <small class="error" slot="required">
                                    A title is needed in order to update the course
                                </small>
                            </field-messages>
                            <label for="course-title">Title
                                <input v-model="course.title" type="text"
                                       name="title"
                                       required
                                       placeholder="Course Title"
                                       id="course-title"/>
                            </label>
                        </div>
                    </div>
                </validate>
                <validate>
                    <div class="grid-x">
                        <div class="cell small-12 large-10">
                            <time-estimate :time-estimate="course.timeEstimate"
                                           :updated="timeEstimateUpdated"
                                           :is-input="true"/>
                        </div>
                    </div>
                </validate>
                <validate>
                    <div class="grid-x">
                        <div class="cell small-12 large-10">
                            <label for="course-description">Description</label>
                            <textarea v-model="course.description" type="text"
                                      placeholder="Course description"
                                      id="course-description"></textarea>
                        </div>
                    </div>
                </validate>
                <div class="grid-x">
                    <div class="small-12 large-10 cell">
                        <edit-training-segments :content-questions="course.contentQuestions" ref="trainingSegment"/>
                    </div>
                </div>
                <div class="grid-x">
                    <div class="cell small-2">
                        <button v-bind:disabled="saving || loading" @click="save" class="button" type="button">Save
                        </button>
                        <button @click="cancel" class="button secondary">Cancel</button>
                    </div>
                </div>
            </vue-form>
        </template>
    </div>
</template>
<script lang="ts" src="./edit_course_component.ts"></script>
