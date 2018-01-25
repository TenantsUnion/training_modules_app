import Vue from 'vue';
import Component from "vue-class-component";
import {Watch} from "vue-property-decorator";
import {QuestionOptionQuillData} from "@shared/questions";
import QuillComponent from "../quill/quill_component";
import SwitchCheckboxComponent from "../switch_checkbox/switch_checkbox";
import {isCreatedQuestionOptionPlaceholderId, QuillDeltaMap} from '@shared/quill_editor';


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
export class QuestionOptionComponent extends Vue {
    storedOption: QuestionOptionQuillData;
    option: QuestionOptionQuillData = null;

    @Watch('storedOption', {immediate: true})
    updatedOption(incomingOption: QuestionOptionQuillData) {
        this.option = incomingOption;
    }

    quillChanges(): QuillDeltaMap {
        let optionQuill = (<QuillComponent> this.$refs.optionQuill);
        let explanationQuill = (<QuillComponent> this.$refs.explanationQuill);
        let changes = {};

        if(optionQuill.hasChanged()){
            changes[this.option.option.id] = optionQuill.getChanges();
        }
        if(explanationQuill.hasChanged()){
            changes[this.option.explanation.id] = explanationQuill.getChanges();
        }

        return changes;
    };

    isCorrectAnswer(): boolean {
        return (<SwitchCheckboxComponent> this.$refs.correctSwitch).isChecked();
    }
}

export default QuestionOptionComponent;
