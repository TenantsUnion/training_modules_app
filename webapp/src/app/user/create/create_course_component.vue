<template>
    <div class="wrapper">
        <div class="page-content-wrapper">
            <div class="main">
                <div class="row">
                    <div class="columns small-12 large-10">
                        <h1>Create Course</h1>
                        <loading v-if="loading"/>
                    </div>
                </div>
                <vue-form :state="formstate" @submit.prevent="createCourse">
                    <validate>

                        <div class="row">
                            <div class="columns small-12 large-10">
                                <div>
                                    <field-messages name="title"
                                                    show="$submitted || $dirty">
                                        <small class="error" slot="required">
                                            A title is need to create a course
                                        </small>
                                    </field-messages>
                                    <label for="course-title">Title
                                        <input v-model="course.title" type="text"
                                               name="title"
                                               required
                                               placeholder="Course Title" id="course-title"/>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="columns small-12 large-10">
                                <time-estimate :time-estimate="course.timeEstimate"
                                               :updated="timeUpdated"
                                               :is-input="true"/>
                            </div>
                        </div>
                        <div class="row">
                            <div class="columns small-12 large-10">
                                <label for="course-description">Description</label>
                                <textarea v-model="course.description" type="text"
                                          placeholder="Course description"
                                          id="course-description"></textarea>
                            </div>
                        </div>
                        <div class="row">
                            <div class="columns small-12 large-10">
                                <label for="course-active">Active
                                    <input v-model="course.active" type="checkbox" id="course-active"/>
                                </label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="columns small-12 large-10">
                                <button @click="createCourseEdit" type="button" class="button">Create and Edit</button>
                                <button @click="createCourse" type="button" class="button">Create</button>
                                <button @click="cancel" type="button" class="button">Cancel</button>
                            </div>
                        </div>
                    </validate>
                </vue-form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./create_course_component.ts"></script>
