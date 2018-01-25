import Vue from 'vue';
import Quill from 'quill';
import Component from "vue-class-component";
import {QuestionChanges, QuestionOptionQuillData, QuestionQuillData} from "@shared/questions";
import {Watch} from "vue-property-decorator";
import {
    createdQuestionOptionPlaceholderId, createdQuillPlaceholderId,
    isCreatedQuestionPlaceholderId, QuillDeltaMap
} from "@shared/quill_editor";
import DeltaStatic = Quill.DeltaStatic;
import {SegmentArrayElement} from "@shared/segment";
import QuestionOptionComponent from "./question_option_component.vue";

let Delta: DeltaStatic = Quill.import('delta');

@Component({
    props: {
        storedQuestion: {
            type: Object,
            required: true
        },
        removeCallback: {
            type: Function,
            required: true
        }
    },
    components: {
        'question-option': QuestionOptionComponent
    }
})
export default class QuestionComponent extends Vue {
    storedQuestion: QuestionQuillData;
    question: QuestionQuillData = null;
    options: (QuestionOptionQuillData & SegmentArrayElement)[] = [];

    @Watch('storedQuestion', {immediate: true})
    updateQuestion(incomingQuestion) {
        this.question = {...incomingQuestion};
        this.options = this.question.options;
    }

    getCurrentQuestion(): QuestionQuillData {
        return {...this.question, options: this.options};
    }

    getQuestionQuillDeltaMapDiff(): QuillDeltaMap {
        return null;
    }

    addOption() {
        let id = createdQuestionOptionPlaceholderId();
        let optionQuillId = createdQuillPlaceholderId();
        let explanationQuillId = createdQuillPlaceholderId();
        this.options.push({
            id: id,
            option: {
                id: optionQuillId,
                version: "0",
                editorJson: new Delta()
            },
            explanation: {
                id: explanationQuillId,
                version: "0",
                editorJson: new Delta()
            },
            removeCallback: () => {
                let rmIndex = this.options.findIndex((el) => el.id === id);
                this.options.splice(rmIndex, 1);
            }
        });

        this.question.optionIds.push(id);
    }

    isCorrectOption(option: QuestionOptionQuillData) {
        return this.question.correctOptionIds.indexOf(option.id) !== -1;
    }

    diffStoredCurrent(): QuestionChanges {
        if (isCreatedQuestionPlaceholderId(this.question.id)) {
            // export interface QuestionQuillData extends QuestionData {
            //     questionQuill: QuillEditorData;
            //     options: QuestionOptionQuillData[];
            // }

            // export interface QuestionData {
            //     id: string;
            //     version: number | string;
            //     questionType: QuestionType,
            //     answerType: AnswerType,
            //     randomizeOptionOrder: boolean,
            //     answerInOrder: boolean,
            //     canPickMultiple: boolean,
            //     createdAt: Date, // date?
            //     lastModifiedAt: Date
            //     correctOptionIds: (string | number)[],
            //     optionIds: (string | number)[],
            // }
            // let  = this.$refs.optionCorrect
            let optionIds = this.options

            let {questionType, answerType, randomizeOptionOrder, canPickMultiple, answerInOrder, questionQuill} = this.question;
            let questionChanges: QuestionChanges = {
                questionType, answerType, randomizeOptionOrder, canPickMultiple, answerInOrder,
                questionQuillId: questionQuill.id,
                // updates covered by overall quill changes so need to only deal with add and remove

                // optionChangesObject:,
                // optionIds: DeltaArrOp[],
                // optionIds: deltaArrayDiff([], createdQuillQuestion.options.map(({id}) => id)),
                // correctOptionIds: deltaArrayDiff([], createdQuillQuestion.options.filter(({}) =>).options.map(({id}) => id)),
            };

            return questionChanges

        }
        return null;
    }
}