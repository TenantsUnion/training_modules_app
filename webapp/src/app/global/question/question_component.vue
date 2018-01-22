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
                              :editor-json="question.questionQuill.editorJson"
                              :editor-id="question.questionQuill.id"/>
            </div>
        </div>
        <div class="grix-x">
            <div class="cell small-12">
                <h6 class="subheader">Options
                    <button type="button" class="button" v-on:click="addOption">Add Option</button>
                </h6>
            </div>
        </div>
        <question-option v-for="option in options" :key="option.id" :stored-option="option" :is-answer="optionIsAnswer(option)"></question-option>
    </div>
</template>

<script lang="ts" src="./question_component.ts"></script>
