import Vue from 'vue';
import Component from "vue-class-component";
import {QuestionOptionQuillData} from "@shared/questions";
import {Prop} from "vue-property-decorator";
import {DeltaStatic} from "quill";

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

    notBlank(json: DeltaStatic) {
        return json.ops && json.ops.length > 0 && json.ops.some((op) => {
            return op.insert !== '\n';
        });
    }
}

export default AnswerQuestionOptionComponent;
