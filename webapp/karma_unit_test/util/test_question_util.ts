import Vue from 'vue';
import Quill from 'quill';
import QuestionComponent from '@global/edit_question/edit_question_component';
import SwitchCheckboxComponent from '@global/switch_checkbox/switch_checkbox';
import QuillComponent from '@global/quill/quill_component';
import {QuillDeltaMap} from '@shared/quill_editor';
import DeltaStatic = Quill.DeltaStatic;

const Delta: DeltaStatic = Quill.import('delta');

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

export type QuestionIdsObj = {
    questionQuillId: string,
    options: { explanationQuillId: string, optionQuillId }[]
}

export const quillDeltaMapFromQuestionAndText = (question: QuestionComponent, questionText: QuestionTextObj) => {
   return deltaMapFromQuestionQuillIdsAndText(questionQuillIdsFromComponent(question), questionText);
};

export const deltaMapFromQuestionQuillIdsAndText = (question: QuestionIdsObj, questionText: QuestionTextObj): QuillDeltaMap => {
    let changes = {
        [question.questionQuillId]: new Delta().insert(questionText.question)
    };
    return question.options.reduce((acc, optionIds, index) => {
        acc[optionIds.optionQuillId] = new Delta().insert(questionText.options[index].option);
        acc[optionIds.explanationQuillId] = new Delta().insert(questionText.options[index].explanation);
        return acc;
    }, changes);
};

export const questionQuillIdsFromComponent = (question: QuestionComponent): QuestionIdsObj => {
    return {
        questionQuillId: question.question.questionQuill.id,
        options: question.options.map((option) => {
            return {
                optionQuillId: option.option.id,
                explanationQuillId: option.explanation.id
            };
        })
    };
};
