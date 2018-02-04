import * as _ from 'underscore';
import Vue from 'vue';
import Quill from 'quill';
import Component from "vue-class-component";
import {
    OptionChangesObj, OptionQuillIdsObj, QuestionChanges, QuestionOptionQuillData,
    QuestionQuillData
} from "@shared/questions";
import {Prop, Watch} from "vue-property-decorator";
import {QuillDeltaMap} from "@shared/quill_editor";
import DeltaStatic = Quill.DeltaStatic;
import {SegmentArrayElement} from "@shared/segment";
import VueQuestionOptionComponent from "./question_option_component.vue";
import {QuestionOptionComponent} from '@global/question/question_option_component';
import {FormState} from '../../vue-form';
import QuillComponent from '@global/quill/quill_component';
import {deltaArrayDiff, DeltaArrOp} from '@shared/delta/diff_key_array';
import {
    createdQuestionOptionPlaceholderId, createdQuillPlaceholderId, isCreatedQuestionOptionPlaceholderId,
    isCreatedQuestionPlaceholderId
} from "@shared/ids";

let Delta: DeltaStatic = Quill.import('delta');

@Component({
    data: () => {
        return {
            formstate: {},
            showQuestion: true
        };
    },
    props: {
        viewOnly: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    components: {
        'question-option': VueQuestionOptionComponent
    }
})
export class QuestionComponent extends Vue {
    @Prop({type: Object, required: true})
    storedQuestion: QuestionQuillData;

    @Prop({type: Function, required: true})
    removeCallback: () => void;

    question: QuestionQuillData = null;
    options: (QuestionOptionQuillData & SegmentArrayElement)[] = [];
    formstate: FormState;
    questionToolbarConfig = [['bold', 'italic', 'underline', 'strike']];

    @Watch('storedQuestion', {immediate: true})
    updateQuestion (incomingQuestion: QuestionQuillData) {
        this.question = {...incomingQuestion};
        this.options = this.question.options ? this.question.options.map((option: QuestionOptionQuillData) => {
            return {
                removeCallback: () => {
                    let rmIndex = this.options.findIndex((el) => el.id === option.id);
                    this.options.splice(rmIndex, 1);
                },
                ...option
            }
        }) : [];
    }

    getCurrentQuestion (): QuestionQuillData {
        return {...this.question, options: this.options};
    }

    quillChanges (): QuillDeltaMap {
        let questionQuill = (<QuillComponent> this.$refs.questionQuill);
        let changes = {};

        if (questionQuill.hasChanged()) {
            changes[this.question.questionQuill.id] = questionQuill.getChanges();
        }

        return this.optionRefs
            .map((option) => option.quillChanges())
            .reduce((acc, optionQuillChanges) => ({...acc, ...optionQuillChanges}), changes);
    }

    addOption () {
        let id = createdQuestionOptionPlaceholderId();
        let optionQuillId = createdQuillPlaceholderId();
        let explanationQuillId = createdQuillPlaceholderId();
        this.options.push({
            id: id,
            version: 0,
            option: {
                id: optionQuillId,
                version: 0,
                editorJson: new Delta()
            },
            explanation: {
                id: explanationQuillId,
                version: 0,
                editorJson: new Delta()
            },
            removeCallback: () => {
                let rmIndex = this.options.findIndex((el) => el.id === id);
                this.options.splice(rmIndex, 1);
            }
        });
    }

    isCorrectOption (option: QuestionOptionQuillData) {
        return this.question.correctOptionIds.indexOf(option.id) !== -1;
    }

    diffQuestion (): QuestionChanges {

        let optionIdsDiff =
            deltaArrayDiff(this.question.options.map(({id}) => id), this.optionRefs.map(({option: {id}}) => id));

        // option changes
        // added
        const optionChangesObject: OptionChangesObj = this.optionRefs.reduce((acc, {option}) => {
            if (isCreatedQuestionOptionPlaceholderId(option.id)) {
                acc[option.id] = <OptionQuillIdsObj> {
                    optionQuillId: option.option.id,
                    explanationQuillId: option.explanation.id
                };
            }
            return acc;
        }, {});

        // removed
        optionIdsDiff.reduce((acc, optionIdOp: DeltaArrOp<string>) => {
            if (optionIdOp.op === 'DELETE') {
                acc[optionIdOp.val] = optionIdOp.op;
            }
            return acc;
        }, optionChangesObject);


        let basicQuestionProps = isCreatedQuestionPlaceholderId(this.question.id) ? this.basicQuestionProps()
            : Object.keys(this.storedQuestion).reduce((acc, key) => {
                if ((typeof key === 'string' || typeof key === 'boolean' || typeof key === 'number') &&
                    this.storedQuestion[key] !== this.question[key]) {
                    acc[key] = this.question[key];
                }
                return acc;
            }, {});

        let currentCorrectOptionIds = this.optionRefs
            .filter((optionComp) => optionComp.isCorrectAnswer())
            .map(({option: {id}}) => id);
        let correctOptionIdsDiff = deltaArrayDiff(this.storedQuestion.correctOptionIds, currentCorrectOptionIds);
        return {
            ...basicQuestionProps,
            optionIds: optionIdsDiff,
            correctOptionIds: correctOptionIdsDiff,
            optionChangesObject
        };
    }

    private basicQuestionProps () {
        const {
            questionType, answerType, randomizeOptionOrder,
            canPickMultiple, answerInOrder, questionQuill
        } = this.question;

        return {
            questionType, answerType, randomizeOptionOrder, canPickMultiple, answerInOrder,
            questionQuillId: questionQuill.id
        }
    }

    get optionRefs (): QuestionOptionComponent[] {
        if (_.isArray(this.$refs.optionRefs)) {
            return (<QuestionOptionComponent[]>this.$refs.optionRefs);
        } else if (_.isObject(this.$refs.optionRefs)) {
            return [(<QuestionOptionComponent> this.$refs.optionRefs)];
        } else {
            return [];
        }
    }
}

export default QuestionComponent;