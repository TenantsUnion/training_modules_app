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
                    <quill-editor ref="explanation"
                                  :editor-id="option.explanation.id"
                                  :editor-json="option.explanation.editorJson"/>
                </div>
            </div>
        </div>
        <div class="cell small-4 large-3">
            <switch-checkbox ref="correctSwitch" switch-text="Correct" :init-checked="false"/>
        </div>
        <button type="button" class="close-button" title="Remove Option"
                v-on:click="option.removeCallback" aria-label="Remove Option">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {Watch} from "vue-property-decorator";
    import {QuestionOptionQuillData} from "@shared/questions";
    import QuillComponent from "../quill/quill_component";
    import SwitchCheckboxComponent from "../switch_checkbox/switch_checkbox";


    @Component({
        props: {
            storedOption: {
                required: true,
                type: Object
            },
            isAnswer: {
                required: true,
                type: Boolean
            }
        }
    })
    export default class QuestionOptionComponent extends Vue {
        storedOption: QuestionOptionQuillData;
        option: QuestionOptionQuillData = null;

        @Watch('storedOption', {immediate: true})
        updatedOption(incomingOption: QuestionOptionQuillData) {
            this.option = incomingOption;
        }

        getCurrentQuestionOptionQuillData(): QuestionOptionQuillData {
            return {
                id: this.option.id,
                option: {
                    id: this.option.option.id,
                    version: "0",
                    editorJson: (<QuillComponent> this.$refs.option).getQuillEditorContents()
                },
                explanation: {
                    id: this.option.explanation.id,
                    version: "0",
                    editorJson: (<QuillComponent> this.$refs.option).getQuillEditorContents()
                }
            };
        }

        optionIsAnswer(): boolean {
            return (<SwitchCheckboxComponent> this.$refs.correctSwitch).isChecked();
        }

    }
</script>

<style scoped>

</style>