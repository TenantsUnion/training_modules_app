import Quill from 'quill';
import Vue from "vue";
import Component from 'vue-class-component';
import {QuillComponent} from '../quill/quill_component';
import {
    ContentSegment, isContentSegment, isQuestionSegment, QuestionSegment,
    SegmentArrayElement
} from '@shared/segment';
import {ContentQuestionsDelta} from '@shared/training_entity';
import {AnswerType, QuestionChangesObj, QuestionQuillData, QuestionType} from '@shared/questions';
import {
    createdQuestionPlaceholderId,
    createdQuillPlaceholderId, isCreatedQuillPlaceholderId, QuillDeltaMap,
    QuillEditorData
} from "@shared/quill_editor";
import {deltaArrayDiff, DeltaArrOp, deltaMapArrayDiff} from "@shared/delta/diff_key_array";
import {Watch} from "vue-property-decorator";

const Delta = Quill.import('delta');

@Component({
    props: {
        storedSegments: {
            type: Array,
            required: true,
        },
        readOnly: {
            type: Boolean,
            default: false
        },
    }
})
export class SegmentViewerComponent extends Vue {
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
                editorJson: editor.getQuillEditorContents()
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

        return {
            quillChanges: this.getContentChanges(),
            questionChanges: this.getQuestionChanges(),
            orderedContentQuestionIds: contentQuestionIds,
            orderedContentIds: contentIds,
            orderedQuestionIds: questionIds,
        };
    }

// todo finish
    getQuestionChanges(): QuestionChangesObj {
        return {};
    }

    getContentChanges(): QuillDeltaMap {
        // todo make this
        let currentSegments: QuillComponent[] = this.$refs.contentEditor ? <QuillComponent[]> this.$refs.contentEditor : [];
        let storedQuillData: QuillDeltaMap = this.currentSegments
            .filter((segment) => isContentSegment(segment))
            .reduce((acc, content: ContentSegment) => {
                acc[content.id] = content.editorJson;
                return acc;
            }, {});
        let userChangedQuillData: QuillDeltaMap = currentSegments.reduce((acc, editor) => {
            acc[editor.editorId] = editor.getQuillEditorContents();
            return acc;
        }, {});
        let quillDiff: QuillDeltaMap = Object.keys(storedQuillData).reduce((acc, id) => {
            let beforeQuill = storedQuillData[id];
            let afterQuill = userChangedQuillData[id];
            if (afterQuill) {
                let diff = beforeQuill.diff(afterQuill);
                if (diff.ops.length > 0) {
                    acc[id] = diff;
                }
            }
            return acc;
        }, {});

        // add created quill data content to quill diff
        Object.keys(userChangedQuillData).filter((quillId) => {
            return isCreatedQuillPlaceholderId(quillId) && isNotEmptyQuillData(userChangedQuillData[quillId]);
        })
            .reduce((acc, quillId) => {
                acc[quillId] = userChangedQuillData[quillId];
                return acc;
            }, quillDiff);

        return quillDiff;
    }

    isContent(segment: ContentSegment | QuestionSegment): boolean {
        return isContentSegment(segment);
    }

    isQuestion(segment: ContentSegment | QuestionSegment): boolean {
        return isQuestionSegment(segment);
    }

    getSegments(): QuillEditorData[] {
        return this.getContents();
    }

    addContent() {
        let addContentId = createdQuillPlaceholderId();
        this.currentSegments.push({
            id: addContentId,
            type: 'CONTENT',
            editorJson: new Delta(),
            removeCallback: () => {
                let rmIndex = this.currentSegments.findIndex((el) => el.id === addContentId);
                this.currentSegments.splice(rmIndex, 1);
            }
        });
    }

    addQuestion() {
        let addContentId = createdQuestionPlaceholderId();
        let questionQuillId = createdQuillPlaceholderId();
        let createdAt = new Date();
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
                    editorJson: new Delta(),
                },
                correctOptionIds: [],
                optionIds: [],
                options: [],
                createdAt: createdAt,
                lastModifiedAt: createdAt,
            }
        });
    }
}

export const isNotEmptyQuillData = (quillData: Quill.DeltaStatic): boolean => {
    return quillData.ops.some((quillOp) => {
        // newly created quill editor will default to single line insert operation
        return quillOp.insert !== '\n';
    });
};
