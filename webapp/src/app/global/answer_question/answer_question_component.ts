import * as _ from 'underscore';
import Vue from 'vue';
import Component from "vue-class-component";
import {
    QuestionOptionQuillData, QuestionQuillData
} from "@shared/questions";
import {Prop} from "vue-property-decorator";
import VueAnswerQuestionOptionComponent from "./answer_question_option_component.vue";
import AnswerQuestionOptionComponent from "@global/answer_question/answer_question_option_component";

@Component({
    components: {
        'answer-question-option': VueAnswerQuestionOptionComponent
    }
})
export class AnswerQuestionComponent extends Vue {
    correctAnswer: boolean = false;
    showQuestion: boolean = true;
    submitted: boolean = false;
    @Prop({type: Object, required: true})
    question: QuestionQuillData;
    @Prop({type: Boolean, required: true})
    individualSubmit: boolean;

    isCorrectOption (option: QuestionOptionQuillData) {
        return this.question.correctOptionIds.indexOf(option.id) !== -1;
    }

    submit () {
        this.submitted = true;
        // compare user selected answers with those correct
        let userAnswer = this.optionRefs
            .filter(({optionSelected}) => optionSelected)
            .map(({option: {id}}) => id);

        this.correctAnswer = (userAnswer.length === this.question.correctOptionIds.length)
        && this.question.correctOptionIds.every(optionId => userAnswer.indexOf(optionId) !== -1);
    }

    reset () {
        this.submitted = false;
    }

    get answerCorrectClasses (): {} {
        return {
            primary: this.submitted && this.correctAnswer,
            alert: this.submitted && !this.correctAnswer
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
