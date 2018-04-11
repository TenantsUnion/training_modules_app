import {expect} from 'chai';
import VueEditTrainingSegmentComponent from '@webapp/training/edit_training_segments/edit_training_segments_component.vue';
import TrainingSegmentComponent from '@webapp/training/edit_training_segments/edit_training_segments_component';
import {
    addQuestionText, QuestionTextObj, quillDeltaMapFromQuestionAndText
} from '@karma_unit_test/util/test_question_util';
import QuestionComponent from '@webapp/training/edit_question/edit_question_component';
import Vue from 'vue';
import {toAddDeltaArrOps} from '@shared/delta/diff_key_array';
import {ContentQuestionsDelta} from '@shared/training';
import QuillComponent from '@webapp/global/quill/quill_component';
import {QuillEditorData} from "@shared/quill_editor";
import {QuestionQuillData} from "@shared/questions";
import Quill from 'quill';

const Delta = Quill.import('delta');

const destroyComponents: Vue[] = [];
const getMountedTrainingSegmentsComponent = (contentQuestions: (QuillEditorData | QuestionQuillData)[] = []): TrainingSegmentComponent => {
    let el = <TrainingSegmentComponent> new VueEditTrainingSegmentComponent({
        propsData: {
            contentQuestions
        }
    }).$mount();
    destroyComponents.push(el);
    return el;
};

const addQuestionAndSetText = async (trainingSegment: TrainingSegmentComponent, questionText: QuestionTextObj): Promise<QuestionComponent> => {
    trainingSegment.addQuestion();
    await Vue.nextTick();

    let question = trainingSegment.questionRefs[trainingSegment.questionRefs.length - 1];
    questionText.options.forEach(() => {
        question.addOption();
    });
    await Vue.nextTick();

    await addQuestionText(question, questionText);
    await Vue.nextTick();
    return question;
};

const addContentAndSetText = async (trainingSegment: TrainingSegmentComponent, contentText: string): Promise<QuillComponent> => {
    trainingSegment.addContent();
    await Vue.nextTick();

    let content = trainingSegment.contentRefs[trainingSegment.contentRefs.length - 1];
    content.quill.insertText(0, contentText, 'user');
    await Vue.nextTick();
    return content;
};

describe('Training Segments Component getContentQuestionsDelta', function () {
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

    after(function () {
        destroyComponents.forEach((c) => c.$destroy());
    });

    it('should be an empty delta when nothing is added', function () {
        expect(getMountedTrainingSegmentsComponent().getContentQuestionsDelta()).to.deep.eq({
            orderedContentIds: [],
            orderedContentQuestionIds: [],
            orderedQuestionIds: [],
            questionChanges: {},
            quillChanges: {}
        });
    });

    it('should be a delta that reflects adding two questions with two options each', async function () {
        let trainingSegments = getMountedTrainingSegmentsComponent();
        let question1 = await addQuestionAndSetText(trainingSegments, question1Text);
        let question2 = await addQuestionAndSetText(trainingSegments, question2Text);

        let {id: question1Id} = question1.question;
        let {id: question2Id} = question2.question;

        expect(trainingSegments.getContentQuestionsDelta()).to.deep.eq({
            orderedContentIds: [],
            orderedQuestionIds: toAddDeltaArrOps([question1Id, question2Id]),
            orderedContentQuestionIds: toAddDeltaArrOps([question1Id, question2Id]),
            questionChanges: {
                [question1Id]: question1.diffQuestion(),
                [question2Id]: question2.diffQuestion()
            },
            quillChanges: {
                ...quillDeltaMapFromQuestionAndText(question1, question1Text),
                ...quillDeltaMapFromQuestionAndText(question2, question2Text)
            }
        });
    });
    it('should be a delta of adding two questions and removing the first one', async function () {
        let trainingSegments = getMountedTrainingSegmentsComponent();
        let question1 = await addQuestionAndSetText(trainingSegments, question1Text);
        let question2 = await addQuestionAndSetText(trainingSegments, question2Text);

        question1.removeCallback();
        await Vue.nextTick();

        let question2Id = question2.question.id;
        expect(trainingSegments.getContentQuestionsDelta()).to.deep.eq(<ContentQuestionsDelta>{
            orderedContentIds: [],
            orderedQuestionIds: toAddDeltaArrOps([question2Id]),
            orderedContentQuestionIds: toAddDeltaArrOps([question2Id]),
            questionChanges: {
                [question2Id]: question2.diffQuestion()
            },
            quillChanges: {
                ...quillDeltaMapFromQuestionAndText(question2, question2Text)
            }
        });
    });
    it('should be a delta of two added content segments', async function () {
        let trainingSegment = getMountedTrainingSegmentsComponent();
        let {editorId: contentId1} = await addContentAndSetText(trainingSegment, content1Text);
        let {editorId: contentId2} = await addContentAndSetText(trainingSegment, content2Text);


        expect(trainingSegment.getContentQuestionsDelta()).to.deep.equal(<ContentQuestionsDelta>{
            orderedQuestionIds: [],
            questionChanges: {},
            orderedContentIds: toAddDeltaArrOps([contentId1, contentId2]),
            orderedContentQuestionIds: toAddDeltaArrOps([contentId1, contentId2]),
            quillChanges: {
                [contentId1]: new Delta().insert(content1Text),
                [contentId2]: new Delta().insert(content2Text)
            }
        });
    });
    it('should be a delta of adding two content segments and remove the first one', async function () {
        let trainingSegment = getMountedTrainingSegmentsComponent();
        let content1 = await addContentAndSetText(trainingSegment, content1Text);
        let {editorId: content2Id} = await addContentAndSetText(trainingSegment, content2Text);

        content1.onRemove();
        await Vue.nextTick();

        expect(trainingSegment.getContentQuestionsDelta()).to.deep.equal({
            orderedQuestionIds: [],
            questionChanges: {},
            orderedContentIds: toAddDeltaArrOps([content2Id]),
            orderedContentQuestionIds: toAddDeltaArrOps([content2Id]),
            quillChanges: {
                [content2Id]: new Delta().insert(content2Text)
            }
        });
    });

    it('should be a delta of adding a content segment and then a question', async function () {
        let trainingSegment = getMountedTrainingSegmentsComponent();
        let {editorId: contentId} = await addContentAndSetText(trainingSegment, content1Text);
        let question = await addQuestionAndSetText(trainingSegment, question1Text);

        let questionId = question.question.id;
        expect(trainingSegment.getContentQuestionsDelta()).to.deep.eq(<ContentQuestionsDelta>{
            orderedContentIds: toAddDeltaArrOps([contentId]),
            orderedQuestionIds: toAddDeltaArrOps([questionId]),
            orderedContentQuestionIds: toAddDeltaArrOps([contentId, questionId]),
            questionChanges: {[questionId]: question.diffQuestion()},
            quillChanges: {
                ...quillDeltaMapFromQuestionAndText(question, question1Text),
                [contentId]: new Delta().insert(content1Text)
            }
        });
    });
});