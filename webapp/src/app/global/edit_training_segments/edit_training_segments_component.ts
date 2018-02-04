import * as _ from 'underscore';
import Quill from 'quill';
import Vue from "vue";
import Component from 'vue-class-component';
import QuillComponent from '../quill/quill_component';
import {
    ContentSegment, isContentSegment, isQuestionSegment, QuestionSegment, SegmentArrayElement
} from '@shared/segment';
import {ContentQuestionsDelta} from '@shared/training_entity';
import {
    AnswerType, isEmptyQuestionChanges, isQuestionData, QuestionQuillData, QuestionType
} from '@shared/questions';
import {isQuillEditorData, QuillEditorData} from "@shared/quill_editor";
import {deltaMapArrayDiff} from "@shared/delta/diff_key_array";
import {Watch} from "vue-property-decorator";
import QuestionComponent from '../question/question_component';
import {createdQuestionPlaceholderId, createdQuillPlaceholderId, isCreatedQuestionPlaceholderId} from "@shared/ids";


const Delta = Quill.import('delta');

@Component({
    props: {
        contentQuestions: {
            type: Array,
            required: true,
        },
        viewOnly: {
            type: Boolean,
            default: false
        },
    }
})
export default class EditTrainingSegmentsComponent extends Vue {
    contentQuestions: (QuillEditorData | QuestionQuillData)[];
    currentSegments: ((ContentSegment | QuestionSegment) & SegmentArrayElement)[] = [];

    @Watch('contentQuestions', {immediate: true})
    syncCurrentSegments (incomingContentQuestions: (QuillEditorData | QuestionQuillData)[]) {
        this.currentSegments = incomingContentQuestions ? incomingContentQuestions.map((contentQuestion) => {
            if (isQuillEditorData(contentQuestion)) {
                return <ContentSegment>{
                    id: contentQuestion.id,
                    type: 'CONTENT',
                    content: contentQuestion,
                    removeCallback: () => {
                        let rmIndex = this.currentSegments.findIndex((el) => el.id === contentQuestion.id);
                        this.currentSegments.splice(rmIndex, 1);
                    }
                }
            } else if (isQuestionData(contentQuestion)) {
                return <QuestionSegment> {
                    id: contentQuestion.id,
                    type: 'QUESTION',
                    question: contentQuestion,
                    removeCallback: () => {
                        let rmIndex = this.currentSegments.findIndex((el) => el.id === contentQuestion.id);
                        this.currentSegments.splice(rmIndex, 1);
                    }
                }
            }
        }) : [];
    }

    getContents (): QuillEditorData[] {
        let contentEditor = this.$refs.contentEditor ? (<QuillComponent[]> this.$refs.contentEditor) : [];
        let contentData = contentEditor.map((editor) => {
            return <ContentSegment> {
                id: editor.editorId,
                type: 'CONTENT',
                content: editor.getQuillEditorContents()
            }
        });
        return [];
    }

    getContentQuestionsDelta (): ContentQuestionsDelta {
        let currentContentQuestions = this.currentSegments.map((segment) => {
            if (isContentSegment(segment)) {
                return segment.content;
            } else if (isQuestionSegment(segment)) {
                return segment.question;
            }
        });

        let contentQuestionIds = deltaMapArrayDiff(this.contentQuestions, currentContentQuestions, (contentQuestions) => {
            return contentQuestions.map(({id}) => id);
        });

        let contentIds = deltaMapArrayDiff(this.contentQuestions, currentContentQuestions, (contentQuestions) => {
            return contentQuestions.filter((obj) => isQuillEditorData(obj))
                .map(({id}) => id);
        });

        let questionIds = deltaMapArrayDiff(this.contentQuestions, currentContentQuestions, (contentQuestions) => {
            return contentQuestions.filter((segment) => isQuestionData(segment))
                .map(({id}) => id);
        });


        let contentQuillDiff = this.contentRefs.reduce((acc, contentQuill: QuillComponent) => {
            if (contentQuill.hasChanged()) {
                acc[contentQuill.editorId] = contentQuill.getChanges();
            }
            return acc;
        }, {});

        let questionQuillDiff = this.questionRefs
            .reduce((acc, question) => ({...acc, ...question.quillChanges()}), {});

        let questionChanges = this.questionRefs.reduce((acc, question) => {
            let {question: {id}} = question;
            let questionChanges = question.diffQuestion();
            if (!isEmptyQuestionChanges(questionChanges) || isCreatedQuestionPlaceholderId(id)) {
                acc[id] = questionChanges;
            }
            return acc;
        }, {});

        return {
            quillChanges: {...contentQuillDiff, ...questionQuillDiff},
            questionChanges,
            orderedContentQuestionIds: contentQuestionIds,
            orderedContentIds: contentIds,
            orderedQuestionIds: questionIds,
        };
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

    get questionRefs (): QuestionComponent[] {
        if (_.isArray(this.$refs.segment)) {
            return (<(QuestionComponent | QuillComponent)[]> this.$refs.segment).filter((segment, index) => {
                return isQuestionSegment(this.currentSegments[index]);
            }).map((questionComponent) => <QuestionComponent>questionComponent);
        } else if (isQuestionSegment(this.currentSegments[0])) {
            return [<QuestionComponent> this.$refs.segment];
        } else {
            return [];
        }
    }

    get contentRefs (): QuillComponent[] {
        if (_.isArray(this.$refs.segment)) {
            return (<(QuestionComponent | QuillComponent)[]> this.$refs.segment).filter((segment, index) => {
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
