import {expect} from 'chai';
import VueQuestionComponent from '@webapp/training/edit_question/edit_question_component.vue';
import {QuestionComponent} from '@webapp/training/edit_question/edit_question_component';
import {AnswerType, QuestionChanges, QuestionOptionQuillData, QuestionQuillData, QuestionType} from '@shared/questions';
import Quill from 'quill';

import QuillComponent from '@webapp/global/quill/quill_component';
import QuestionOptionComponent from '@webapp/training/edit_question/edit_question_option_component';
import Vue from 'vue';
import {addDeltaArrOp} from '@shared/delta/diff_key_array';
import {createdQuestionPlaceholderId, createdQuillPlaceholderId} from "@shared/ids";
import {setOptionIsCorrect} from "@karma_unit_test/util/test_question_util";

const Delta = Quill.import('delta');

describe('Question Component', function () {

    const questionQuillId = createdQuillPlaceholderId();
    const storedQuestion: QuestionQuillData = {
        id: createdQuestionPlaceholderId(),
        version: 0,
        questionType: QuestionType.DEFAULT,
        answerType: AnswerType.DEFAULT,
        randomizeOptionOrder: true,
        answerInOrder: false,
        canPickMultiple: false,
        correctOptionIds: [],
        questionQuill: {
            id: questionQuillId,
            version: 0,
            editorJson: new Delta()
        },
        options: <QuestionOptionQuillData[]> []
    };

    const mountedCreatedQuestionComponent = (question?: any): QuestionComponent => {
        let props: { storedQuestion: QuestionQuillData, removeCallback: () => void } = {
            storedQuestion: {...storedQuestion, ...question},
            removeCallback: () => {
            }
        };
        return <QuestionComponent> new VueQuestionComponent({
            propsData: props
        }).$mount();
    };

    const mountedQuestionComponent = (question?: any): QuestionComponent => {
        let props: { storedQuestion: QuestionQuillData, removeCallback: () => void } = {
            storedQuestion: {...storedQuestion, ...question, id: 'QU1'},
            removeCallback: () => {
            }
        };
        return <QuestionComponent> new VueQuestionComponent({
            propsData: props
        }).$mount();
    };

    describe('Quill Delta Map', function () {
        it('should return an quill delta map with the questionQuillId when initialized', function () {
            let questionComponent = mountedCreatedQuestionComponent();
            expect(questionComponent.quillChanges()).to.deep.equal({
                [questionComponent.question.questionQuill.id]:  new Delta()
            });
        });

        it('should indicate that the question quill data has changed', function () {
            let questionComponent = mountedCreatedQuestionComponent();
            let {quill} = <QuillComponent> questionComponent.$refs.questionQuill;
            let questionText = `This is some question text`;
            quill.insertText(0, questionText, 'user');

            expect(questionComponent.quillChanges()).to.deep.equal({
                [questionQuillId]: new Delta().insert(questionText)
            });
        });

        it('should have the explanation and option quill data from an added option', async function () {
            let questionComponent = mountedCreatedQuestionComponent();
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
            let questionComponent = mountedCreatedQuestionComponent();
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
            let questionComponent = mountedCreatedQuestionComponent();
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
                    [addedOption.id]: {
                        optionQuillId: addedOption.option.id,
                        explanationQuillId: addedOption.explanation.id
                    }
                }
            });
        });

        it('should return an empty question changes object when question hasn\'t changed', async function () {
            let questionComponent = mountedQuestionComponent();
            await Vue.nextTick();
            expect(questionComponent.diffQuestion()).to.deep.eq({
                correctOptionIds: [],
                optionIds: [],
                optionChangesObject: {}
            });
        });

        it('should indicate that the can answer multiple and the randomize option order values have changed', async function () {
            let questionComponent = mountedQuestionComponent();
            await Vue.nextTick();
            questionComponent.question.randomizeOptionOrder = false; // stored question is true
            questionComponent.question.canPickMultiple = true; // stored question is false

            expect(questionComponent.diffQuestion()).to.deep.eq({
                canPickMultiple: true,
                randomizeOptionOrder: false,
                correctOptionIds: [],
                optionIds: [],
                optionChangesObject: {}
            });
        });

        it('should return that two options have been added with the second option marked correct', async function () {
            let questionComponent = mountedCreatedQuestionComponent();
            questionComponent.addOption();
            questionComponent.addOption();

            await Vue.nextTick();
            const firstOption = questionComponent.options[0];
            const secondOption = questionComponent.options[1];
            setOptionIsCorrect(questionComponent, 1, true);

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
                    [firstOption.id]: {
                        optionQuillId: firstOption.option.id,
                        explanationQuillId: firstOption.explanation.id
                    },
                    [secondOption.id]: {
                        optionQuillId: secondOption.option.id,
                        explanationQuillId: secondOption.explanation.id
                    }
                }
            });
        });
    });
});