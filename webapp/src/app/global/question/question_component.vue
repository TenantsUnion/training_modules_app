<template>
    <div class="grid-container fluid callout">
        <div class="grid-x">
            <div class="cell small-11 large-9">
                <h6 class="subheader">Question</h6>
            </div>
            <div class="cell small-1 large-3">
                <button type="button" class="close-button" title="Remove Question"
                        v-on:click="removeCallback" aria-label="Remove Question">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
        <div class="grid-x">
            <div class="cell small-12">
                <field-messages name="question" show="$submitted || $dirty">
                    <small class="error" slot="required">
                        Question content needed
                    </small>
                </field-messages>
                <quill-editor ref="questionQuill"
                              :editor-json="currentQuestion.questionQuill.editorJson"
                              :editor-id="currentQuestion.questionQuill.id"/>
            </div>
        </div>
        <div class="grix-x">
            <div class="cell small-12">
                <h6 class="subheader">Options
                    <button type="button" class="button" v-on:click="addOption">Add Option</button>
                </h6>
            </div>
        </div>
        <div v-for="option in currentOptions" :key="option.id" class="grid-x callout">
            <div class="cell small-6 large-9">
                <quill-editor ref="optionQuill"
                              :editor-id="option.option.id"
                              :editor-json="option.option.editorJson"/>
            </div>
            <div class="cell small-4 large-3">
                <switch-checkbox switch-text="Correct"/>
            </div>
            <button type="button" class="close-button" title="Remove Option"
                    v-on:click="option.removeCallback" aria-label="Remove Option">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import {QuestionComponent} from './question_component';
    export default QuestionComponent;
</script>
