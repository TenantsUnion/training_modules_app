<template>
    <div class="grid-x callout small-12 large-11">
        <div class="cell small-11">
            <div class="grid-x">
                <div class="cell small-12">
                    <div v-if="!viewOnly" class="cell small-4 large-3">
                        <switch-checkbox ref="correctSwitch" switch-text="Correct" :checked="isAnswer"/>
                    </div>
                    <quill-editor ref="optionQuill"
                                  :read-only="viewOnly"
                                  :editor-id="option.option.id"
                                  :editor-json="option.option.editorJson"
                                  :toolbar-config="questionOptionToolbarConfig"/>
                </div>
                <div class="cell small-12">
                    <h6 class="subheader">Explanation
                        <button v-if="!showExplanationField" type="button" class="button" title="Add Option Explanation"
                                v-on:click="showExplanationField = !showExplanationField"
                                aria-label="Add Option Explanation">
                            <i class="fa fa-plus fa-fw" aria-hidden="true"></i>
                        </button>

                        <button v-if="showExplanationField" type="button" class="button" title="Hide Option Explanation"
                                v-on:click="showExplanationField = !showExplanationField"
                                aria-label="Hide Option Explanation">
                            <i class="fa fa-chevron-up fa-fw" aria-hidden="true"></i>
                        </button>
                    </h6>
                </div>
                <div class="cell small-12">
                    <div class="explanation-container" v-show="showExplanationField">
                        <quill-editor ref="explanationQuill"
                                      :read-only="viewOnly"
                                      :editor-id="option.explanation.id"
                                      :editor-json="option.explanation.editorJson"
                                      :toolbar-config="questionOptionToolbarConfig"/>
                    </div>
                </div>
            </div>
        </div>
        <button v-if="!viewOnly" type="button" class="close-button" title="Remove Option"
                v-on:click="option.removeCallback" aria-label="Remove Option">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
</template>
<script lang="ts" src="./edit_question_option_component.ts"></script>
