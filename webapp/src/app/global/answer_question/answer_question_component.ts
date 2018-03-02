import * as _ from 'underscore';
import Vue from 'vue';
import Component from "vue-class-component";
import {
    QuestionOptionQuillData, QuestionQuillData
} from "@shared/questions";
import {Prop} from "vue-property-decorator";
import VueAnswerQuestionOptionComponent from "./answer_question_option_component.vue";
import AnswerQuestionOptionComponent from "@global/answer_question/answer_question_option_component";
import {QuestionSubmission} from "@shared/user_progress";

@Component({
    components: {
        'answer-question-option': VueAnswerQuestionOptionComponent
    }
})
export class AnswerQuestionComponent extends Vue {
    showQuestion: boolean = true;
    submitted: boolean = false;
    @Prop({type: Object, required: true})
    question: QuestionQuillData;
    @Prop({type: Boolean, required: true, default: () => null})
    individualSubmit: boolean;
    @Prop({type: Function, required: false})
    individualSubmitCb: (submission: QuestionSubmission) => any;

    isCorrectOption (option: QuestionOptionQuillData) {
        return this.question.correctOptionIds.indexOf(option.id) !== -1;
    }

    submit () {
        this.markSubmitted();
        this.individualSubmitCb(this.submission());
    }

    submission (): QuestionSubmission {
        return {
            questionId: this.question.id,
            chosenQuestionOptionIds: this.selectedOptions(),
            possibleQuestionOptionIds: this.question.options.map(({id}) => id),
            correct: this.isCorrect()
        };
    }

    selectedOptions () {
        return this.optionRefs
            .filter(({optionSelected}) => optionSelected)
            .map(({option: {id}}) => id);
    }

    isCorrect () {
        let userAnswer = this.selectedOptions();
        return userAnswer.length === this.question.correctOptionIds.length
            && this.question.correctOptionIds.every(optionId => userAnswer.indexOf(optionId) !== -1);

    }

    markSubmitted () {
        this.submitted = true;
    }

    reset () {
        this.submitted = false;
    }

    get answerCorrectClasses (): {} {
        return {
            primary: this.submitted && this.isCorrect(),
            alert: this.submitted && !this.isCorrect()
        }
    }

    get optionRefs (): AnswerQuestionOptionComponent[] {
        if (_.isArray(this.$refs.optionRefs)) {
            return (<AnswerQuestionOptionComponent[]>this.$refs.optionRefs);
        } else if (_.isObject(this.$refs.optionRefs)) {
            return [(<AnswerQuestionOptionComponent> this.$refs.optionRefs)];
        } else {
            return [];
        }
    }
}

export default AnswerQuestionComponent;
