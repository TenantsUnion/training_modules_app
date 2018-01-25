import QuestionComponent from '@global/question/question_component';
import SwitchCheckboxComponent from '@global/switch_checkbox/switch_checkbox';

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



