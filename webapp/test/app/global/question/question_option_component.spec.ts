import {expect} from 'chai';
import {QuestionOptionComponent} from '@global/question/question_option_component';
import VueQuestionOptionComponent from '@global/question/question_option_component.vue';
import {QuestionOptionQuillData} from '@shared/questions';
import {createdQuestionOptionPlaceholderId, createdQuillPlaceholderId} from '@shared/quill_editor';
import {registerGlobalComponents} from '../../../../src/app/globals';
import {SegmentArrayElement} from '@shared/segment';
import QuillComponent from '@global/quill/quill_component';
import {Quill} from 'quill';
import SwitchCheckboxComponent from '@global/switch_checkbox/switch_checkbox';

let Delta: Quill.DeltaStatic = Quill.import('delta');

describe('Question Option Component', function () {
    registerGlobalComponents();
    const optionQuillId = createdQuillPlaceholderId();
    const explanationQuillId = createdQuillPlaceholderId();
    let storedOption: QuestionOptionQuillData & SegmentArrayElement = {
        id: createdQuestionOptionPlaceholderId(),
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
        }
    };
    const mountedQuestionOptionComponent = (isAnswer: boolean = false, option: QuestionOptionQuillData & SegmentArrayElement = storedOption) => {
        return <QuestionOptionComponent> new VueQuestionOptionComponent({
            propsData: {
                storedOption: option,
                isAnswer
            }
        }).$mount();
    };
    describe('Quill Changes', function () {
        it('should return that no quill changes have happened right after initialization', function () {
            expect(mountedQuestionOptionComponent().quillChanges()).to.deep.equal({});
        });

        it('should return that the explanation quill editor has changed', function () {
            let questionOptionComponent = mountedQuestionOptionComponent();

            let optionQuill: Quill = (<QuillComponent> questionOptionComponent.$refs.optionQuill).quill;
            const insert = 'The text for the option';
            optionQuill.insertText(0, insert, 'user');
            expect(questionOptionComponent.quillChanges()).to.deep.equal({
                [optionQuillId]: new Delta().insert(`${insert}`)
            });
        });

        it('should return changes that have been done to the option and explanation quill editor', function () {
            let questionOptionComponent = mountedQuestionOptionComponent();

            let optionQuill: Quill = (<QuillComponent> questionOptionComponent.$refs.optionQuill).quill;
            let explanationQuill: Quill = (<QuillComponent> questionOptionComponent.$refs.explanationQuill).quill;
            const insertOption = 'The text for the option';
            const insertExplanation = 'The text for the explanation';

            optionQuill.insertText(0, insertOption, 'user');
            explanationQuill.insertText(0, insertExplanation, 'user');
            expect(questionOptionComponent.quillChanges()).to.deep.equal({
                [optionQuillId]: new Delta().insert(`${insertOption}`),
                [explanationQuillId]: new Delta().insert(`${insertExplanation}`)
            });
        });
    });
    describe('optionIsCorrect', function () {
        it('should indicate the option is an answer', function () {
            let questionOptionComponent = mountedQuestionOptionComponent(true);
            expect(questionOptionComponent.isCorrectAnswer()).to.be.true;
        });

        it('should indicate the option is not an answer after correct switch is toggled', async function () {
            let questionOptionComponent = mountedQuestionOptionComponent(true);
            (<SwitchCheckboxComponent>questionOptionComponent.$refs.correctSwitch).vmChecked = false;
            expect(questionOptionComponent.isCorrectAnswer()).to.be.false;
        })
    });


});