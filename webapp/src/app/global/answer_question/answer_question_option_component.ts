import Vue from 'vue';
import Component from "vue-class-component";
import {QuestionOptionQuillData} from "@shared/questions";
import {Prop} from "vue-property-decorator";

@Component({})
export class AnswerQuestionOptionComponent extends Vue {
    @Prop({required: true, type: Object})
    option: QuestionOptionQuillData;
    @Prop({required: true, type: Boolean})
    submitted: boolean;
    @Prop({required: true, type: Boolean})
    isCorrect: boolean;
    optionSelected: boolean = false;

    get optionClasses(): {} {
        return {
            chosen: this.optionSelected && !this.submitted,
            correct: this.isCorrect && this.submitted,
            wrong: this.optionSelected && !this.isCorrect && this.submitted
        };
    }
}

export default AnswerQuestionOptionComponent;
