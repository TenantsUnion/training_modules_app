<template>
    <div>
        <div v-for="(segment, index) in currentSegments" :key="segment.id">
            <quill-editor v-if="isContent(segment)" ref="segment"
                          :read-only="true"
                          :editor-json="segment.content.editorJson"
                          :editor-id="segment.id"/>
            <answer-question v-if="isQuestion(segment)" ref="segment"
                             :individual-submit="individualSubmit"
                             :individual-submit-cb="individualSubmitCb"
                             :question="segment.question"/>
        </div>
        <div v-if="!individualSubmit"><button v-on:click="submit()" type="button" class="button primary">Submit</button></div>
    </div>
</template>
<script lang="ts" src="./view_training_segments_component.ts"></script>
