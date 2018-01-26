import Vue from 'vue';
import QuestionComponent from '@global/question/question_component';
import SwitchCheckboxComponent from '@global/switch_checkbox/switch_checkbox';
import TrainingSegmentComponents from '@global/training_segments/training_segments_component';
import QuillComponent from '@global/quill/quill_component';

export const setOptionIsCorrect = (questionComponent: QuestionComponent, optionIndex: number, val: boolean) => {
    try {
        let {optionRefs} = questionComponent;
        if (optionIndex >= optionRefs.length) {
            throw new Error(`Invalid optionIndex: ${optionIndex}. Question Component has ${optionRefs.length} options`)
        }

        let option = optionRefs[optionIndex];
        (<SwitchCheckboxComponent>option.$refs.correctSwitch).vmChecked = val;
    } catch (e) {
        console.log(e);
        console.log(e.stack);
        throw e;
    }
};

export type QuestionTextObj = { question: string, options: { option: string, explanation: string }[] };
export const addQuestionText = async (questionComponent: QuestionComponent, text: QuestionTextObj) => {
    (<QuillComponent> questionComponent.$refs.questionQuill).quill.insertText(0, text.question, 'user');
    text.options.forEach(({option, explanation}, index) => {
        const optionRefs = questionComponent.optionRefs[index].$refs;
        (<QuillComponent>optionRefs.optionQuill).quill.insertText(0, option, 'user');
        (<QuillComponent>optionRefs.explanationQuill).quill.insertText(0, explanation, 'user');
    });
    await Vue.nextTick();
};
