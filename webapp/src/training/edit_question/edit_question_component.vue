<template>
    <div class="grid-container fluid callout question-component">
        <div class="grid-x">
            <div class="cell small-11 large-9">
                <h5 class="subheader">Question</h5>
            </div>
            <div class="cell small-1 large-3">
                <button type="button" class="minimize-button" title="Minimize Question"
                        v-on:click="showQuestion = !showQuestion" aria-label="Minimize Question">
                    <span aria-hidden="true">&ndash;</span>
                </button>
                <button type="button" class="close-button" title="Remove Question"
                        v-on:click="removeCallback" aria-label="Remove Question">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
        <div class="question-container" v-show="showQuestion">
            <vue-form :state="formstate">
                <div class="grid-x">
                    <div class="cell small-12">
                        <field-messages name="question" show="$submitted || $dirty">
                            <small class="error" slot="required">
                                Question content needed
                            </small>
                        </field-messages>
                        <quill-editor ref="questionQuill"
                                      :read-only="false"
                                      :editor-json="question.questionQuill.editorJson"
                                      :editor-id="question.questionQuill.id"
                                      :toolbar-config="questionToolbarConfig"/>
                    </div>
                </div>
                <div class="grix-x">
                    <div class="cell small-12">
                        <h6 class="subheader">Options
                            <button type="button" class="button" v-on:click="addOption" ref="addOptionBtn">Add Option
                            </button>
                        </h6>
                    </div>
                </div>
            </vue-form>
            <question-option v-for="option in options" :key="option.id" :stored-option="option" ref="optionRefs"
                             :is-answer="isCorrectOption(option)"></question-option>
        </div>
    </div>
</template>

<style lang="scss" src="./edit_question_component.scss" scoped></style>
<script lang="ts" src="./edit_question_component.ts"></script>
