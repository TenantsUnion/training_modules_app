<template>
    <div class="grid-x callout">
        <div class="cell callout small-6 large-9">
            <div class="grid-x">
                <div class="cell small-12">
                    <h6 class="subheader">Option</h6>
                    <quill-editor ref="optionQuill"
                                  :editor-id="option.option.id"
                                  :editor-json="option.option.editorJson"/>
                </div>
                <div class="cell small-12">
                    <h6 class="subheader">Explanation</h6>
                    <quill-editor ref="explanationQuill"
                                  :editor-id="option.explanation.id"
                                  :editor-json="option.explanation.editorJson"/>
                </div>
            </div>
        </div>
        <div class="cell small-4 large-3">
            <switch-checkbox ref="correctSwitch" switch-text="Correct" :checked="isAnswer"/>
        </div>
        <button type="button" class="close-button" title="Remove Option"
                v-on:click="option.removeCallback" aria-label="Remove Option">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
</template>
<script lang="ts" src="./question_option_component.ts"></script>
