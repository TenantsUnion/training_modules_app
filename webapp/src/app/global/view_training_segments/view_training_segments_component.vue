<template>
    <div>
        <div v-for="(segment, index) in currentSegments" :key="segment.id">
            <quill-editor v-if="isContent(segment)" ref="segment"
                          :read-only="true"
                          :editor-json="segment.content.editorJson"
                          :editor-id="segment.id"/>
            <answer-question v-if="isQuestion(segment)"
                             :individual-submit="true"
                             :question="segment.question"/>
        </div>
    </div>
</template>
<script lang="ts" src="./view_training_segments_component.ts"></script>
