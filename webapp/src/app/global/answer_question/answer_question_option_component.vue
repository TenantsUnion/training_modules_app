<template>
    <div class="grid-x">
        <div class="choose-option cell small-1">
            <input type="checkbox" v-model="optionSelected"/>
        </div>
        <div class="cell small-11 option" v-bind:class="optionClasses">
            <div class="cell full width">
                <quill-editor ref="optionQuill"
                              :read-only="true"
                              :editor-id="option.option.id"
                              :editor-json="option.option.editorJson"/>
            </div>
            <div class="cell full width">
                <div class="explanation-container" v-show="submitted">
                    <quill-editor ref="explanationQuill"
                                  :read-only="true"
                                  :editor-id="option.explanation.id"
                                  :editor-json="option.explanation.editorJson"/>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
    div .choose-option {
        margin: auto 0;
    }

    div .option {
        &.chosen {
            background-color: map-get($foundation-palette, primary);
        }
        &.correct {
            background-color: map-get($foundation-palette, success);
        }
        &.wrong {
            background-color: map-get($foundation-palette, alert);
        }
    }
</style>
<script lang="ts" src="./answer_question_option_component.ts"></script>
