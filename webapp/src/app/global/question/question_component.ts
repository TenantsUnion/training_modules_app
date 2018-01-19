import Vue from 'vue';
import Quill from 'quill';
import Component from "vue-class-component";
import {QuestionOptionData, QuestionOptionQuillData, QuestionQuillData} from "@shared/questions";
import {Watch} from "vue-property-decorator";
import {createdQuestionOptionPlaceholderId, createdQuillPlaceholderId} from "@shared/quill_editor";
import DeltaStatic = Quill.DeltaStatic;
import {SegmentArrayElement} from "@shared/segment";

let Delta: DeltaStatic = Quill.import('delta');

@Component({
    props: {
        question: {
            type: Object,
            required: true
        },
        removeCallback: {
            type: Function,
            required: true
        }
    },
    // language=HTML
    template: `
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
                                  :editor-id="currentQuestion.questionQuill.id"></quill-editor>
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
                                  :editor-json="option.option.editorJson"></quill-editor>
                </div>
                <div class="cell small-4 large-3">
                    <switch-checkbox switch-text="Correct"></switch-checkbox>
                </div>
                <button type="button" class="close-button" title="Remove Option"
                        v-on:click="option.removeCallback" aria-label="Remove Option">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
    `
})
export class QuestionComponent extends Vue {
    question: QuestionQuillData;
    currentQuestion: QuestionQuillData = null;
    currentOptions: (QuestionOptionQuillData & SegmentArrayElement)[] = [];

    @Watch('question', {immediate: true})
    updateQuestion (incomingQuestions) {
        this.currentQuestion = {...incomingQuestions};
    }

    addOption () {
        let id = createdQuestionOptionPlaceholderId();
        let optionQuillId = createdQuillPlaceholderId();
        let explanationQuillId = createdQuillPlaceholderId();
        this.currentOptions.push({
            id: id,
            option: {
                id: optionQuillId,
                editorJson: new Delta()
            },
            explanation: {
                id: explanationQuillId,
                editorJson: new Delta()
            },
            removeCallback: () => {
                let rmIndex = this.currentOptions.findIndex((el) => el.id === id);
                this.currentOptions.splice(rmIndex, 1);
            }
        })
    }
}