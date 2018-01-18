import Vue from "vue";
import Component from 'vue-class-component';
import {QuillComponent} from '../quill/quill_component';
import {ContentSegment, isContentSegment, Segment} from '../../../../../shared/segment';
import {ContentQuestionsDelta} from '../../../../../shared/training_entity';
import {QuestionChangesObj} from '../../../../../shared/questions';
import {isCreatedQuillPlaceholderId, QuillDeltaMap, QuillEditorData} from "../../../../../shared/quill_editor";


@Component({
    props: {
        segments: {
            type: Array,
            required: true,
        },
        readOnly: {
            type: Boolean,
            default: false
        },
    },
    template: `
        <div>
            <div v-for="(segment, index) in segments" :key="segment.id">
                <quill-editor v-if="isContent(segment)" ref="contentEditor"
                              :editor-json="segment.editorJson"
                              :editor-id="segment.id"
                              :on-change="segment.onChangeCallback"
                              :on-remove="segment.removeCallback"
                              :key="segment.id"></quill-editor>
            </div>
        </div>
    `
})
export class SegmentViewerComponent extends Vue {
    segments: Segment[];

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
        return {
            quillChanges: this.getContentChanges(),
            questionChanges: this.getQuestionChanges(),
            orderedContentQuestionIds: [],
            orderedContentIds: [],
            orderedQuestionIds: [],
        };
    }

    // todo finish
    getQuestionChanges(): QuestionChangesObj {
        return {};
    }

    getContentChanges(): QuillDeltaMap {
        let userChangedEditor: QuillComponent[] = this.$refs.contentEditor ? <QuillComponent[]> this.$refs.contentEditor : [];
        let storedQuillData: QuillDeltaMap = this.segments
            .filter((segment) => isContentSegment(segment))
            .reduce((acc, content: ContentSegment) => {
                acc[content.id] = content.editorJson;
                return acc;
            }, {});
        let userChangedQuillData: QuillDeltaMap = userChangedEditor.reduce((acc, editor) => {
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

    isContent(obj: any): boolean {
        return obj && obj.type === 'CONTENT';
    }

    getSegments(): QuillEditorData[] {
        return this.getContents();
    }
}

export const isNotEmptyQuillData = (quillData: Quill.DeltaStatic): boolean => {
    return quillData.ops.some((quillOp) => {
        // newly created quill editor will default to single line insert operation
        return quillOp.insert !== '\n';
    });
};
