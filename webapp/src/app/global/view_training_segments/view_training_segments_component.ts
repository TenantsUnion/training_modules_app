import * as _ from 'underscore';
import Quill from 'quill';
import Vue from "vue";
import Component from 'vue-class-component';
import QuillComponent from '../quill/quill_component';
import {
    ContentSegment, isContentSegment, isQuestionSegment, QuestionSegment, SegmentArrayElement
} from '@shared/segment';
import {isQuestionData, QuestionQuillData} from '@shared/questions';
import {isQuillEditorData, QuillEditorData} from "@shared/quill_editor";
import {Prop} from "vue-property-decorator";
import AnswerQuestionComponentVue from '@global/answer_question/answer_question_component.vue';
import AnswerQuestionComponent from "@global/answer_question/answer_question_component";

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
    submitCb: () => any;
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
                return isQuestionSegment(this.currentSegments[index]);
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
}

export const isNotEmptyQuillData = (quillData: Quill.DeltaStatic): boolean => {
    return quillData.ops.some((quillOp) => {
        // newly created quill editor will default to single line insert operation
        return quillOp.insert !== '\n';
    });
};
