<template>
    <div>
        <div v-for="(segment, index) in currentSegments" :key="segment.id">
            <quill-editor v-if="isContent(segment)" ref="contentEditor"
                          :editor-json="segment.editorJson"
                          :editor-id="segment.id"
                          :on-change="segment.onChangeCallback"
                          :on-remove="segment.removeCallback"/>
            <question v-if="isQuestion(segment)" ref="storedQuestion" :remove-callback="segment.removeCallback" :stored-question="segment.question"/>
        </div>
        <div class="row">
            <div class="columns small-12 medium-6">
                <button title="Add Content" type="button" class="button" v-on:click="addContent">
                    Add Content
                    <i class="fa fa-plus fa-fw" aria-hidden="true"></i>
                </button>
            </div>
            <div class="columns small-12 medium-6">
                <button title="Add Question" type="button" class="button" v-on:click="addQuestion">
                    Add Question
                    <i class="fa fa-plus fa-fw" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </div>
</template>
<script lang="ts" src="./segment_viewer_component.ts"></script>
