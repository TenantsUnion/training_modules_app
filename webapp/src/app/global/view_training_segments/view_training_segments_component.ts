import * as _ from 'underscore';
import Quill from 'quill';
import Vue from "vue";
import Component from 'vue-class-component';
import QuillComponent from '../quill/quill_component';
import {
    ContentSegment, isContentSegment, isQuestionSegment, QuestionSegment, SegmentArrayElement
} from '@shared/segment';
import {
    AnswerType, isQuestionData, QuestionQuillData, QuestionType
} from '@shared/questions';
import {isQuillEditorData, QuillEditorData} from "@shared/quill_editor";
import {Watch} from "vue-property-decorator";
import AnswerQuestionComponentVue from '@global/answer_question/answer_question_component.vue';
import {createdQuestionPlaceholderId, createdQuillPlaceholderId} from "@shared/ids";
import AnswerQuestionComponent from "@global/answer_question/answer_question_component";


const Delta = Quill.import('delta');

@Component({
    components: {
        'answer-question': AnswerQuestionComponentVue
    },
    props: {
        contentQuestions: {
            type: Array,
            required: true,
        },
        submitIndividualQuestions: {
            type: Boolean,
            required: true
        }
    }
})
export default class ViewTrainingSegmentsComponent extends Vue {
    contentQuestions: (QuillEditorData | QuestionQuillData)[];
    currentSegments: ((ContentSegment | QuestionSegment) & SegmentArrayElement)[] = [];

    @Watch('contentQuestions', {immediate: true})
    syncCurrentSegments (incomingContentQuestions: (QuillEditorData | QuestionQuillData)[]) {
        this.currentSegments = incomingContentQuestions ? incomingContentQuestions.map((contentQuestion) => {
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
    }

    isContent (segment: ContentSegment | QuestionSegment): boolean {
        return isContentSegment(segment);
    }

    isQuestion (segment: ContentSegment | QuestionSegment): boolean {
        return isQuestionSegment(segment);
    }

    addContent () {
        let addContentId = createdQuillPlaceholderId();
        this.currentSegments.push({
            id: addContentId,
            type: 'CONTENT',
            content: {
                id: addContentId,
                version: 0,
                editorJson: new Delta()
            },
            removeCallback: () => {
                let rmIndex = this.currentSegments.findIndex((el) => el.id === addContentId);
                this.currentSegments.splice(rmIndex, 1);
            }
        });
    }

    addQuestion () {
        let questionId = createdQuestionPlaceholderId();
        let questionQuillId = createdQuillPlaceholderId();
        this.currentSegments.push(<QuestionSegment>{
            id: questionId,
            type: 'QUESTION',
            removeCallback: () => {
                let rmIndex = this.currentSegments.findIndex((el) => el.id === questionId);
                this.currentSegments.splice(rmIndex, 1);
            },
            question: {
                id: questionId,
                version: 0,
                questionType: QuestionType.DEFAULT,
                answerType: AnswerType.DEFAULT,
                answerInOrder: false,
                canPickMultiple: false,
                randomizeOptionOrder: true,
                questionQuill: {
                    id: questionQuillId,
                    version: 0,
                    editorJson: new Delta(),
                },
                correctOptionIds: [],
                optionIds: [],
                options: [],
            }
        });
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
