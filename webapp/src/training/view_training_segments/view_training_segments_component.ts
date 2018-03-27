import _ from 'underscore';
import {DeltaStatic} from 'quill';
import Vue from "vue";
import Component from 'vue-class-component';
import QuillComponent from '@webapp/global/quill/quill_component';
import {
    ContentSegment, isContentSegment, isQuestionSegment, QuestionSegment, SegmentArrayElement
} from '@shared/segment';
import {isQuestionData, QuestionQuillData} from '@shared/questions';
import {isQuillEditorData, QuillEditorData} from '@shared/quill_editor';
import {Prop} from "vue-property-decorator";
import AnswerQuestionComponentVue from '@webapp/training/answer_question/answer_question_component.vue';
import AnswerQuestionComponent from "@webapp/training/answer_question/answer_question_component";
import {QuestionSubmission} from "@shared/user_progress";

@Component({
    components: {
        'answer-question': AnswerQuestionComponentVue
    },
    props: {}
})
export default class ViewTrainingSegmentsComponent extends Vue {
    @Prop({type: Boolean, required: true})
    individualSubmit: boolean;
    @Prop({type: Function, required: false, default: () => null})
    individualSubmitCb: () => any;
    @Prop({type: Function, required: false, default: () => null})
    submitCb: (submissions: QuestionSubmission[]) => Promise<any>;
    @Prop({type: Array, required: true})
    contentQuestions: (QuillEditorData | QuestionQuillData)[];

    get currentSegments (): ((ContentSegment | QuestionSegment) & SegmentArrayElement)[] {
        return this.contentQuestions ? this.contentQuestions.map((contentQuestion) => {
            if (isQuillEditorData(contentQuestion)) {
                return <ContentSegment>{
                    id: contentQuestion.id,
                    type: 'CONTENT',
                    content: contentQuestion
                }
            } else if (isQuestionData(contentQuestion)) {
                return <QuestionSegment> {
                    id: contentQuestion.id,
                    type: 'QUESTION',
                    question: contentQuestion
                }
            }
        }) : [];
    };

    isContent (segment: ContentSegment | QuestionSegment): boolean {
        return isContentSegment(segment);
    }

    isQuestion (segment: ContentSegment | QuestionSegment): boolean {
        return isQuestionSegment(segment);
    }

    get questionRefs (): AnswerQuestionComponent[] {
        if (_.isArray(this.$refs.segment)) {
            return (<(AnswerQuestionComponent | QuillComponent)[]> this.$refs.segment).filter((segment, index) => {
                let questionSegment = isQuestionSegment(this.currentSegments[index]);
                console.log('element: ' + index + ' is question segment ' + questionSegment);
                return questionSegment;
            }).map((questionComponent) => <AnswerQuestionComponent>questionComponent);
        } else if (isQuestionSegment(this.currentSegments[0])) {
            return [<AnswerQuestionComponent> this.$refs.segment];
        } else {
            return [];
        }
    }

    get contentRefs (): QuillComponent[] {
        if (_.isArray(this.$refs.segment)) {
            return (<(AnswerQuestionComponent | QuillComponent)[]> this.$refs.segment).filter((segment, index) => {
                return isContentSegment(this.currentSegments[index]);
            }).map((questionComponent) => <QuillComponent>questionComponent);
        } else if (isContentSegment(this.currentSegments[0])) {
            return [<QuillComponent> this.$refs.segment];
        } else {
            return [];
        }
    }

    contentIds (): string[] {
        return this.currentSegments
            .filter((segment) => this.isContent(segment))
            .map((contentSegment) => contentSegment.id);
    }

    async submit () {
        this.questionRefs.forEach((question) => question.markSubmitted());
        let submissions = this.questionRefs.map((question) => question.submission());
        await this.submitCb(submissions);
    }
}

export const isNotEmptyQuillData = (quillData: DeltaStatic): boolean => {
    return quillData.ops.some((quillOp) => {
        // newly created quill editor will default to single line insert operation
        return quillOp.insert !== '\n';
    });
};
