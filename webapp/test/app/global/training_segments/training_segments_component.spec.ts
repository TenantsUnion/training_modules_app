import {expect} from 'chai';
import VueTrainingSegmentComponent from '@global/training_segments/training_segments_component.vue';
import TrainingSegmentComponent from '@global/training_segments/training_segments_component';
import {ContentSegment, QuestionSegment} from '@shared/segment';
import {addQuestionText, QuestionTextObj} from '../../../util/test_question_util';
import QuestionComponent from '@global/question/question_component';
import {QuillDeltaMap} from '@shared/quill_editor';
import Quill from 'quill';
import Vue from 'vue';

let Delta = Quill.import('delta');

const destroyComponents: Vue[] = [];
const getMountedTrainingSegmentsComponent = (storedSegments: (ContentSegment | QuestionSegment)[] = []): TrainingSegmentComponent => {
    let el = <TrainingSegmentComponent> new VueTrainingSegmentComponent({
        propsData: {
            storedSegments
        }
    }).$mount();
    destroyComponents.push(el);
    return el;
};

const question1Text: QuestionTextObj = {
    question: 'Question 1 is a question??',
    options: [{
        option: 'Option 1 Text',
        explanation: 'Explanation 1 Text',
    }, {
        option: 'Option 2 Text',
        explanation: 'Explanation 2 Text'
    }]
};
const question2Text: QuestionTextObj = {
    question: 'Question 2 is a question??????',
    options: [{
        option: 'Option 3 Text',
        explanation: 'Explanation 3 Text'
    }, {

        option: 'Option 4 Text',
        explanation: 'Explanation 4 Text'
    }]
};
const content1Text = 'Text content 1';
const content2Text = 'Lets get textual content 2';

const initTwoQuestions = async (trainingSegments: TrainingSegmentComponent) => {
    trainingSegments.addQuestion();
    trainingSegments.addQuestion();
    await Vue.nextTick();

    const {0: question1, 1: question2} = <QuestionComponent[]> trainingSegments.questionRefs;
    question1.addOption();
    question1.addOption();
    question2.addOption();
    question2.addOption();

    await Vue.nextTick();

    await addQuestionText(question1, question1Text);
    await addQuestionText(question2, question2Text);
};
describe('Training Segments Component', function () {

    after(function () {
        destroyComponents.forEach((c) => c.$destroy());
    });

    describe('getQuillDiff', function () {
        it('should return an empty object when there are no questions or content', function () {
            expect(getMountedTrainingSegmentsComponent().getQuillDiff()).to.deep.eq({});

        });
        it('should have the quill content of two questions each with two options', async function () {
            let trainingSegments = getMountedTrainingSegmentsComponent();
            await initTwoQuestions(trainingSegments);

            const {0: question1, 1: question2} = <QuestionComponent[]> trainingSegments.questionRefs;
            let {id: questionQuillId1} = question1.question.questionQuill;
            let {id: questionQuillId2} = question2.question.questionQuill;

            let option1 = question1.optionRefs[0].option;
            let option2 = question1.optionRefs[1].option;
            let option3 = question2.optionRefs[0].option;
            let option4 = question2.optionRefs[1].option;

            expect(trainingSegments.getQuestionsQuillDiff()).to.deep.eq(<QuillDeltaMap>{
                [questionQuillId1]: new Delta().insert(question1Text.question),
                [questionQuillId2]: new Delta().insert(question2Text.question),
                [option1.option.id]: new Delta().insert(question1Text.options[0].option),
                [option2.option.id]: new Delta().insert(question1Text.options[1].option),
                [option3.option.id]: new Delta().insert(question2Text.options[0].option),
                [option4.option.id]: new Delta().insert(question2Text.options[1].option),
                [option1.explanation.id]: new Delta().insert(question1Text.options[0].explanation),
                [option2.explanation.id]: new Delta().insert(question1Text.options[1].explanation),
                [option3.explanation.id]: new Delta().insert(question2Text.options[0].explanation),
                [option4.explanation.id]: new Delta().insert(question2Text.options[1].explanation),
            });

        });
        it('should have the quill content of one question after two questions are added and one is removed', async function () {
            let trainingSegments = getMountedTrainingSegmentsComponent();
            await initTwoQuestions(trainingSegments);

            const {0: question1, 1: question2} = <QuestionComponent[]> trainingSegments.questionRefs;
            question1.removeCallback();
            await Vue.nextTick();

            let {id: questionQuillId2} = question2.question.questionQuill;
            let option3 = question2.optionRefs[0].option;
            let option4 = question2.optionRefs[1].option;

            expect(trainingSegments.getQuestionsQuillDiff()).to.deep.eq(<QuillDeltaMap>{
                [questionQuillId2]: new Delta().insert(question2Text.question),
                [option3.option.id]: new Delta().insert(question2Text.options[0].option),
                [option4.option.id]: new Delta().insert(question2Text.options[1].option),
                [option3.explanation.id]: new Delta().insert(question2Text.options[0].explanation),
                [option4.explanation.id]: new Delta().insert(question2Text.options[1].explanation),
            });
        });
        it('should have the quill content of two content segments', async function () {
            let trainingSegment = getMountedTrainingSegmentsComponent();
            trainingSegment.addContent();
            trainingSegment.addContent();
            await Vue.nextTick();

            let {0: content1, 1: content2} = trainingSegment.contentRefs;
            content1.quill.insertText(0, content1Text, 'user');
            content2.quill.insertText(0, content2Text, 'user');
            await Vue.nextTick();

            expect(trainingSegment.getContentQuillDiff()).to.deep.equal({
                [content1.editorId]: new Delta().insert(content1Text),
                [content2.editorId]: new Delta().insert(content2Text)
            });
        });
        it('should have the quill content of one content segment after two content segments are added and one is removed', async function () {
            let trainingSegment = getMountedTrainingSegmentsComponent();

            trainingSegment.addContent();
            trainingSegment.addContent();
            await Vue.nextTick();

            let {0: content1, 1: content2} = trainingSegment.contentRefs;
            content1.quill.insertText(0, content1Text, 'user');
            content2.quill.insertText(0, content2Text, 'user');
            content1.onRemove();
            await Vue.nextTick();

            expect(trainingSegment.getContentQuillDiff()).to.deep.equal({
                [content2.editorId]: new Delta().insert(content2Text)
            });
        });
    });
    it('should have the quill data from an added a question and a content segment', async function () {
        let trainingSegment = getMountedTrainingSegmentsComponent();
        trainingSegment.addContent();
        trainingSegment.addQuestion();
        await Vue.nextTick();

        const question = trainingSegment.questionRefs[0];
        question.addOption();
        question.addOption();
        await Vue.nextTick();

        const content = trainingSegment.contentRefs[0];
        content.quill.insertText(0, content1Text, 'user');
        await addQuestionText(question, question1Text);
        await Vue.nextTick();


        expect(trainingSegment.getQuillDiff()).to.deep.eq(<QuillDeltaMap>{
            [question.question.questionQuill.id]: new Delta().insert(question1Text.question),
            [question.optionRefs[0].option.option.id]: new Delta().insert(question1Text.options[0].option),
            [question.optionRefs[1].option.option.id]: new Delta().insert(question1Text.options[1].option),
            [question.optionRefs[0].option.explanation.id]: new Delta().insert(question1Text.options[0].explanation),
            [question.optionRefs[1].option.explanation.id]: new Delta().insert(question1Text.options[1].explanation),
            [content.editorId]: new Delta().insert(content1Text)
        });
    })

});