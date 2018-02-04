<template>
    <div>
        <div v-for="(segment, index) in currentSegments" :key="segment.id">
            <quill-editor v-if="isContent(segment)" ref="segment"
                          :read-only="true"
                          :editor-json="segment.content.editorJson"
                          :editor-id="segment.id"
                          :on-remove="segment.removeCallback"/>
            <question v-if="isQuestion(segment)"
                      :view-only="true"
                      ref="segment"
                      :remove-callback="segment.removeCallback" :stored-question="segment.question"/>
        </div>
    </div>
</template>
<script lang="ts" src="./view_training_segments_component.ts"></script>
