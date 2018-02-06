<template>
    <div class="main">
        <div class="row">
            <div class="small-12 large-10 columns">
                <h1>Create Module</h1>
                <loading v-if="loading"/>
            </div>
        </div>
        <vue-form :state="formstate" @submit.prevent="createModule">
            <validate>
                <div class="row">
                    <div class="columns small-12 large-10">
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
                <div class="row">
                    <div class="columns small-12 large-10">
                        <time-estimate :is-input="true" :time-estimate="timeEstimate" :updated="timeEstimateUpdated"/>
                    </div>
                </div>
                <div class="row">
                    <div class="columns small-12 large-10">
                        <label for="module-description">Description</label>
                        <textarea v-model="description" type="text"
                                  placeholder="Course description"
                                  id="module-description"></textarea>
                    </div>
                </div>
            </validate>
            <div class="row">
                <div class="columns small-2">
                    <button @click="createModule" class="button" type="button">Create</button>
                </div>
            </div>
        </vue-form>
    </div>
</template>
<script lang="ts">
    import * as VueForm from "../../../vue-form";
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import {Segment} from "../../../../../../shared/segment";
    import {MODULE_ACTIONS} from "../../store/module/module_actions";
    import {Location} from 'vue-router';
    import {CreateModuleEntityPayload} from "../../../../../../shared/modules";
    import {PREVIEW_COURSE_ROUTES} from "../../../global/routes";

    @Component({
        data: () => {
            return {
                active: true,
                loading: false,
                errorMessages: null,
                title: '',
                timeEstimate: null,
                description: '',
                formstate: {}
            }
        },
    })
    export default class CreateModuleComponent extends Vue {
        errorMessages: {};
        loading: boolean;
        title: string;
        timeEstimate: number;
        description: string;
        active: boolean;
        formstate: VueForm.FormState;
        quillContent: Segment[] = [];

        async createModule () {
            this.formstate._submit();
            if (this.formstate.$invalid) {
                return;
            }

            this.loading = true;
            this.errorMessages = null;

            try {
                let createModulePayload: CreateModuleEntityPayload = <CreateModuleEntityPayload> {
                    title: this.title,
                    description: this.description,
                    timeEstimate: this.timeEstimate,
                    active: this.active,
                    answerImmediately: true,
                    courseId: <string> this.$store.state.course.currentCourseId,
                    contentQuestions: {
                        quillChanges: {},
                        questionChanges: {},
                        orderedContentQuestionIds: [],
                        orderedContentIds: [],
                        orderedQuestionIds: []
                    }
                };
                await this.$store.dispatch(MODULE_ACTIONS.CREATE_MODULE, createModulePayload);

                this.$router.push(<Location>{
                    name: PREVIEW_COURSE_ROUTES.modulePreview,
                    params: {moduleSlug: this.$store.getters.getModuleSlugFromId(this.$store.state.module.currentModuleId)}
                });
            } catch (errorMessages) {
                console.error(errorMessages);
                // todo check if error message object from server and display, if not print stack trace since it is likely a client thrown error
                this.errorMessages = errorMessages;
            } finally {
                this.loading = false;
            }
        }

        timeEstimateUpdated (time) {
            this.timeEstimate = time;
        }
    }

</script>
