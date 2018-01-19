<template>
    <div class="wrapper">
        <div class="page-content-wrapper">
            <div class="main">
                <div class="row">
                    <div class="columns small-12 large-10">
                        <h1>Create Course</h1>
                        <loading v-if="loading"></loading>
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
                                <segment-viewer :stored-segments="quillContent" ref="segmentViewer"></segment-viewer>
                            </div>
                        </div>
                        <div class="row">
                            <div class="columns small-12 large-10">
                                <button @click="createCourse" type="button" class="button">Create</button>
                            </div>
                        </div>
                    </validate>
                </vue-form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import Component from "vue-class-component";
    import {CreateCourseEntityPayload} from '@shared/courses';
    import {SegmentViewerComponent} from '../../global/segment_viewer/segment_viewer_component';
    import {FormState} from '../../vue-form';
    import {Segment} from '@shared/segment';
    import {COURSE_ACTIONS} from '../store/course/course_actions';
    import {appRouter} from '../../router';
    import {COURSES_ROUTE_NAMES} from '../courses_routes';

    @Component({
        data: () => {
            return {
                loading: false,
                errorMessages: null,
                course: {
                    active: true,
                    openEnrollment: true,
                    title: '',
                    description: '',
                    timeEstimate: '',
                    createdBy: '',
                    contentQuestions: null
                },
                formstate: {},
                quillContent: []
            };
        },
    })
    export default class CreateCourseComponent extends Vue {
        errorMessages: {};
        loading: boolean;
        course: CreateCourseEntityPayload;
        quillContent: Segment[] = [];
        formstate: FormState;

        async createCourse() {
            this.formstate._submit();
            if (this.formstate.$invalid) {
                return;
            }
            this.loading = true;
            this.errorMessages = null;
            let createCoursePayload: CreateCourseEntityPayload = {
                title: this.course.title,
                timeEstimate: this.course.timeEstimate,
                active: this.course.active,
                openEnrollment: this.course.openEnrollment,
                contentQuestions: (<SegmentViewerComponent> this.$refs.segmentViewer).getContentQuestionsDelta(),
                description: this.course.description
            };
            try {
                await this.$store.dispatch(COURSE_ACTIONS.CREATE_COURSE, createCoursePayload);
                appRouter.push({
                    name: COURSES_ROUTE_NAMES.adminCourseDetails,
                    params: {
                        courseSlug: this.$store.getters.getSlugFromCourseId(this.$store.state.course.currentCourseId)
                    }
                });

            } catch (msg) {
                this.errorMessages = msg;
            } finally {
                this.loading = false
            }
        }

        timeUpdated(time: string) {
            this.course.timeEstimate = time;
        }

    }
</script>
