import {expect} from 'chai';
import VueQuestionComponent from '@global/question/question_component.vue';
import {QuestionComponent} from '@global/question/question_component';
import {AnswerType, QuestionChanges, QuestionOptionQuillData, QuestionQuillData, QuestionType} from '@shared/questions';
import {createdQuestionPlaceholderId, createdQuillPlaceholderId} from '@shared/quill_editor';
import Quill from 'quill';

import DeltaStatic = Quill.DeltaStatic;
import QuillComponent from '@global/quill/quill_component';
import QuestionOptionComponent from '@global/question/question_option_component';
import Vue from 'vue';
import {addDeltaArrOp} from '@shared/delta/diff_key_array';
import SwitchCheckboxComponent from '@global/switch_checkbox/switch_checkbox';

let Delta: DeltaStatic = Quill.import('delta');

describe('Question Component', function () {


    const questionQuillId = createdQuillPlaceholderId();
    const storedQuestion: QuestionQuillData = {
        id: createdQuestionPlaceholderId(),
        version: "0",
        questionType: QuestionType.DEFAULT,
        answerType: AnswerType.DEFAULT,
        randomizeOptionOrder: true,
        answerInOrder: false,
        canPickMultiple: false,
        correctOptionIds: [],
        optionIds: [],
        questionQuill: {
            id: questionQuillId,
            version: "0",
            editorJson: new Delta()
        },
        options: <QuestionOptionQuillData[]> []
    };
    const mountedQuestionComponent = (question?: any): QuestionComponent => {
        let props: { storedQuestion: QuestionQuillData, removeCallback: () => void } = {
            storedQuestion: {...storedQuestion, ...question},
            removeCallback: () => {
            }
        };
        return <QuestionComponent> new VueQuestionComponent({
            propsData: props
        }).$mount();
    };

    describe('Quill Delta Map', function () {
        it('should return an empty quill delta map when initialized with no quill data', function () {
            let questionComponent = mountedQuestionComponent();
            expect(questionComponent.quillChanges()).to.deep.equal({});
        });

        it('should indicate that the question quill data has changed', function () {
            let questionComponent = mountedQuestionComponent();
            let {quill} = <QuillComponent> questionComponent.$refs.questionQuill;
            let questionText = `This is some question text`;
            quill.insertText(0, questionText, 'user');

            expect(questionComponent.quillChanges()).to.deep.equal({
                [questionQuillId]: new Delta().insert(questionText)
            });
        });

        it('should have the explanation and option quill data from an added option', async function () {
            let questionComponent = mountedQuestionComponent();
            questionComponent.addOption();

            let {quill: questionQuill} = <QuillComponent> questionComponent.$refs.questionQuill;
            let questionText = `This is some question text`;
            questionQuill.insertText(0, questionText, 'user');

            await Vue.nextTick();

            let option: QuestionOptionComponent = <QuestionOptionComponent> questionComponent.$refs.optionRefs[0];
            let optionQuill: QuillComponent = <QuillComponent> option.$refs.optionQuill;
            let optionText = `OMM NOMM OPTION`;
            optionQuill.quill.insertText(0, optionText, 'user');

            let explanationQuill: QuillComponent = <QuillComponent> option.$refs.explanationQuill;
            let explanationText = `EXPLANATIONNNNNNN`;
            explanationQuill.quill.insertText(0, explanationText, 'user');

            expect(questionComponent.quillChanges()).to.deep.equal({
                [questionQuillId]: new Delta().insert(questionText),
                [optionQuill.editorId]: new Delta().insert(optionText),
                [explanationQuill.editorId]: new Delta().insert(explanationText)
            });
        });
    });

    describe('Diff Question', function () {
        it('should return the primitive types and quill id of a newly created question', function () {
            let questionComponent = mountedQuestionComponent();
            let questionChanges: QuestionChanges = questionComponent.diffQuestion();

            expect(questionChanges).to.deep.eq(<QuestionChanges>{
                questionType: QuestionType.DEFAULT,
                answerType: AnswerType.DEFAULT,
                answerInOrder: false,
                canPickMultiple: false,
                randomizeOptionOrder: true,
                questionQuillId: questionQuillId,
                optionIds: [],
                correctOptionIds: [],
                optionChangesObject: {}
            })
        });

        it('should return the primitive types and an added option of a newly created question', async function () {
            let questionComponent = mountedQuestionComponent();
            questionComponent.addOption();
            await Vue.nextTick();
            let questionChanges: QuestionChanges = questionComponent.diffQuestion();

            const addedOption = questionComponent.options[0];
            expect(questionChanges).to.deep.eq(<QuestionChanges>{
                questionType: QuestionType.DEFAULT,
                answerType: AnswerType.DEFAULT,
                answerInOrder: false,
                canPickMultiple: false,
                randomizeOptionOrder: true,
                questionQuillId: questionQuillId,
                optionIds: [addDeltaArrOp(addedOption.id, 0)],
                correctOptionIds: [],
                optionChangesObject: {
                    [addedOption.id] : {
                        optionQuillId: addedOption.option.id,
                        explanationQuillId: addedOption.explanation.id
                    }
                }
            });
        });

        it('should return that two options have been added with the second option marked correct', async function () {
            let questionComponent = mountedQuestionComponent();
            questionComponent.addOption();
            questionComponent.addOption();

            await Vue.nextTick();
            const firstOption = questionComponent.options[0];
            const secondOption = questionComponent.options[1];
            (<SwitchCheckboxComponent> questionComponent.optionRefs[1].$refs.correctSwitch).vmChecked = true;

            let questionChanges: QuestionChanges = questionComponent.diffQuestion();
            expect(questionChanges).to.deep.eq(<QuestionChanges>{
                questionType: QuestionType.DEFAULT,
                answerType: AnswerType.DEFAULT,
                answerInOrder: false,
                canPickMultiple: false,
                randomizeOptionOrder: true,
                questionQuillId: questionQuillId,
                optionIds: [addDeltaArrOp(firstOption.id, 0), addDeltaArrOp(secondOption.id, 1)],
                correctOptionIds: [addDeltaArrOp(secondOption.id, 0)],
                optionChangesObject: {
                    [firstOption.id] : {
                        optionQuillId: firstOption.option.id,
                        explanationQuillId: firstOption.explanation.id
                    },
                    [secondOption.id] : {
                        optionQuillId: secondOption.option.id,
                        explanationQuillId: secondOption.explanation.id
                    }
                }
            });
        });
    });
});