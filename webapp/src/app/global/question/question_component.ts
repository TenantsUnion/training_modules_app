import Vue from 'vue';
import Quill from 'quill';
import Component from "vue-class-component";
import {QuestionOptionQuillData, QuestionQuillData} from "@shared/questions";
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