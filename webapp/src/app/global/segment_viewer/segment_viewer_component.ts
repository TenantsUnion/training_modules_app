import Quill from 'quill';
import Vue from "vue";
import Component from 'vue-class-component';
import {QuillComponent} from '../quill/quill_component';
import {
    ContentSegment, isContentSegment, isQuestionSegment, QuestionSegment, Segment,
    SegmentArrayElement
} from '@shared/segment';
import {ContentQuestionsDelta} from '@shared/training_entity';
import {AnswerType, QuestionChanges, QuestionChangesObj, QuestionQuillData, QuestionType} from '@shared/questions';
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
        readOnly: {
            type: Boolean,
            default: false
        },
    }
})
export default class SegmentViewerComponent extends Vue {
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
            quillChanges: this.calculateQuillDiff(),
            questionChanges: this.getQuestionChanges(),
            orderedContentQuestionIds: contentQuestionIds,
            orderedContentIds: contentIds,
            orderedQuestionIds: questionIds,
        };
    }

// todo finish
    getQuestionChanges(): QuestionChangesObj {
        let questionRefs: QuestionComponent[] = this.$refs.question ? <QuestionComponent[]> this.$refs.question : [];

        questionRefs.reduce((acc, questionComponent) => {
            let questionChanges: QuestionChanges = questionComponent.diffStoredCurrent();
            return acc;
        }, {});


        return {};
    }

    /**
     * Finds all the quill deltas that has changed for content
     * @returns {QuillDeltaMap}
     */
    calculateQuillDiff(): QuillDeltaMap {
        let storedQuillContent: QuillDeltaMap = quillMapFromSegments(this.storedSegments);

        let contentRefs: QuillComponent[] = this.$refs.contentEditor ? <QuillComponent[]> this.$refs.contentEditor : [];
        let questionRefs: QuestionComponent[] = this.$refs.question ? <QuestionComponent[]> this.$refs.question : [];

        let currentContentQuill: QuillDeltaMap = contentRefs.reduce((acc, editor) => {
            acc[editor.editorId] = editor.getQuillEditorContents();
            return acc;
        }, {});

        let currentQuestionQuill: QuillDeltaMap = questionRefs
            .map((component) => questionToQuillMap(component.getCurrentQuestion()))
            .reduce((acc, questionQuillMap) => ({...acc, ...questionQuillMap}), {});

        let currentQuillMap = {...currentContentQuill, ...currentQuestionQuill};

        let quillDiff: QuillDeltaMap = Object.keys(storedQuillContent).reduce((acc, id) => {
            let beforeQuill = storedQuillContent[id];
            let afterQuill = currentQuillMap[id];
            if (afterQuill) {
                let diff = beforeQuill.diff(afterQuill);
                if (diff.ops.length > 0) {
                    acc[id] = diff;
                }
            }
            return acc;
        }, {});

        // add created quill data content to quill diff
        Object.keys(currentQuillMap)
            .filter((quillId) => {
                return isCreatedQuillPlaceholderId(quillId) && isNotEmptyQuillData(currentQuillMap[quillId]);
            })
            .reduce((acc, quillId) => {
                acc[quillId] = currentQuillMap[quillId];
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

/**
 * Creates a map of all quill data in the provided segments array of content, question, or a questions options
 * @param {Segment[]} segments
 * @returns {QuillDeltaMap}
 */
const quillMapFromSegments = (segments: Segment[]): QuillDeltaMap => {
    return segments
        .map((segment): QuillDeltaMap => {
            if (isQuestionSegment(segment)) {
                return questionToQuillMap(segment.question);
            } else if (isContentSegment(segment)) {
                return {[segment.id]: segment.editorJson}
            }
        })
        .reduce((acc, quillMap) => ({...acc, ...quillMap}), {});
};

/**
 * Maps the specified to question object to an object whose keys are the ids of the quill data of the question and
 * its options.
 * @param {QuestionQuillData} question
 * @returns {QuillDeltaMap}
 */
export const questionToQuillMap = (question: QuestionQuillData): QuillDeltaMap => {
    let {questionQuill} = question;
    let quillData: QuillDeltaMap = {};
    quillData[questionQuill.id] = questionQuill.editorJson;

    question.options.reduce((acc, optionData) => {
        let {explanation, option} = optionData;
        quillData[explanation.id] = explanation.editorJson;
        quillData[option.id] = option.editorJson;
        return acc;
    }, quillData);

    return quillData;
};
