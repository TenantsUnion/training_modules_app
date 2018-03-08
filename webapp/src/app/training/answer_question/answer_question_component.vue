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
            </div>
        </div>
        <div class="question-container" v-show="showQuestion">
            <div class="grid-x grid-padding-y">
                <div class="cell full width">
                    <quill-editor ref="questionQuill"
                                  :read-only="true"
                                  :editor-json="question.questionQuill.editorJson"
                                  :editor-id="question.questionQuill.id"/>
                </div>
            </div>
            <div class="grid-x callout" v-bind:class="answerCorrectClasses">
                <div class="cell full width">
                    <answer-question-option v-for="option in question.options" :key="option.id" ref="optionRefs"
                                            :option="option" :is-correct="isCorrectOption(option)"
                                            :submitted="submitted"/>
                </div>
                <div class="grid-x grid-padding-y" v-if="individualSubmit">
                    <div class="cell shrink">
                        <button class="button submit-question" type="button" v-on:click="submit()">Submit</button>
                        <button class="button submit-question secondary" type="button" v-on:click="reset()">Reset</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    button.submit-question {
        margin: 0;
    }
</style>
<script lang="ts" src="./answer_question_component.ts"></script>