import * as _ from 'underscore';
import Quill from 'quill';
import Vue from "vue";
import Component from 'vue-class-component';
import QuillComponent from '../quill/quill_component';
import {
    ContentSegment, isContentSegment, isQuestionSegment, QuestionSegment, Segment,
    SegmentArrayElement
} from '@shared/segment';
import {ContentQuestionsDelta} from '@shared/training_entity';
import {
    AnswerType, isEmptyQuestionChanges, QuestionChanges, QuestionChangesObj, QuestionQuillData,
    QuestionType
} from '@shared/questions';
import {
    createdQuestionPlaceholderId,
    createdQuillPlaceholderId, isCreatedQuillPlaceholderId, QuillDeltaMap
} from "@shared/quill_editor";
import {deltaMapArrayDiff} from "@shared/delta/diff_key_array";
import {Watch} from "vue-property-decorator";
import QuestionComponent from '../question/question_component';


const Delta = Quill.import('delta');

@Component({
    props: {
        storedSegments: {
            type: Array,
            required: true,
        },
        viewOnly: {
            type: Boolean,
            default: false
        },
    }
})
export default class TrainingSegmentsComponent extends Vue {
    storedSegments: (ContentSegment | QuestionSegment)[];
    currentSegments: ((ContentSegment | QuestionSegment) & SegmentArrayElement)[] = [];

    @Watch('storedSegments', {immediate: true})
    syncCurrentSegments(incomingSegments: ContentSegment[]) {
        this.currentSegments = [...incomingSegments];
    }

    getContents(): ContentSegment[] {
        let contentEditor = this.$refs.contentEditor ? (<QuillComponent[]> this.$refs.contentEditor) : [];
        let contentData = contentEditor.map((editor) => {
            return <ContentSegment> {
                id: editor.editorId,
                type: 'CONTENT',
                content: editor.getQuillEditorContents()
            }
        });
        return contentData;
    }

    getContentQuestionsDelta(): ContentQuestionsDelta {
        let contentQuestionIds = deltaMapArrayDiff(this.storedSegments, this.currentSegments, (segments: ContentSegment[]) => {
            return segments.map(({id}) => id);
        });

        let contentIds = deltaMapArrayDiff(this.storedSegments, this.currentSegments, (segments: ContentSegment[]) => {
            return segments.filter((segment) => isContentSegment(segment))
                .map(({id}) => id);
        });

        let questionIds = deltaMapArrayDiff(this.storedSegments, this.currentSegments, (segments: ContentSegment[]) => {
            return segments.filter((segment) => isQuestionSegment(segment))
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
            let questionChanges = question.diffQuestion();
            if (!isEmptyQuestionChanges(questionChanges)) {
                acc[question.question.id] = questionChanges;
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

    isContent(segment: ContentSegment | QuestionSegment): boolean {
        return isContentSegment(segment);
    }

    isQuestion(segment: ContentSegment | QuestionSegment): boolean {
        return isQuestionSegment(segment);
    }

    addContent() {
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

    addQuestion() {
        let addContentId = createdQuestionPlaceholderId();
        let questionQuillId = createdQuillPlaceholderId();
        this.currentSegments.push(<QuestionSegment>{
            id: addContentId,
            type: 'QUESTION',
            removeCallback: () => {
                let rmIndex = this.currentSegments.findIndex((el) => el.id === addContentId);
                this.currentSegments.splice(rmIndex, 1);
            },
            question: {
                id: addContentId,
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

    get questionRefs(): QuestionComponent[] {
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

    get contentRefs(): QuillComponent[] {
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
