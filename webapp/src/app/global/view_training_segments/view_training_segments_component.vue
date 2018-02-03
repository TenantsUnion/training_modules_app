<template>
    <div>
        <div v-for="(segment, index) in currentSegments" :key="segment.id">
            <quill-editor v-if="isContent(segment)" ref="segment"
                          :read-only="viewOnly"
                          :editor-json="segment.editorJson"
                          :editor-id="segment.id"
                          :on-remove="segment.removeCallback"/>
            <question v-if="isQuestion(segment)"
                      :view-only="viewOnly"
                      ref="segment"
                      :remove-callback="segment.removeCallback" :stored-question="segment.question"/>
        </div>
        <div v-if="!viewOnly" class="row">
            <div class="columns small-12 medium-6">
                <button title="Add Content" type="button" class="button" v-on:click="addContent" ref="addContentBtn">
                    Add Content
                    <i class="fa fa-plus fa-fw" aria-hidden="true"></i>
                </button>
            </div>
            <div class="columns small-12 medium-6">
                <button title="Add Question" type="button" class="button" v-on:click="addQuestion" ref="addQuestionBtn">
                    Add Question
                    <i class="fa fa-plus fa-fw" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </div>
</template>
<script lang="ts" src="./view_training_segments_component.ts"></script>
