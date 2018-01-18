import Quill from 'quill';
import Vue from "vue";
import Component from 'vue-class-component';
import {QuillComponent} from '../quill/quill_component';
import {ContentSegment, isContentSegment, isQuestionSegment} from '@shared/segment';
import {ContentQuestionsDelta} from '@shared/training_entity';
import {QuestionChangesObj} from '@shared/questions';
import {isCreatedQuillPlaceholderId, QuillDeltaMap, QuillEditorData} from "@shared/quill_editor";
import {deltaArrayDiff, DeltaArrOp, deltaMapArrayDiff} from "@shared/delta/diff_key_array";
import {Watch} from "vue-property-decorator";

const Delta = Quill.import('delta');


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
    // language=HTML
    template: `
        <div>
            <div v-for="(segment, index) in currentSegments" :key="segment.id">
                <quill-editor v-if="isContent(segment)" ref="contentEditor"
                              :editor-json="segment.editorJson"
                              :editor-id="segment.id"
                              :on-change="segment.onChangeCallback"
                              :on-remove="segment.removeCallback"
                              :key="segment.id"></quill-editor>
            </div>
            <div class="row">
                <div class="columns small-12 large-10">
                    <add-content-component :callback="addContentCallback"></add-content-component>
                </div>
            </div>
        </div>
    `
})
export class SegmentViewerComponent extends Vue {
    segments: ContentSegment[];
    currentSegments: ContentSegment[] = [];

    @Watch('segments', {immediate: true})
    syncCurrentSegments(incomingSegments: ContentSegment[]){
        this.currentSegments = [...incomingSegments];
    }
    getContents (): ContentSegment[] {
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

    getContentQuestionsDelta (): ContentQuestionsDelta {
        let contentQuestionIds = deltaMapArrayDiff(this.segments, this.currentSegments, (segments: ContentSegment[]) => {
            return segments.map(({id}) => id);
        });

        let contentIds = deltaMapArrayDiff(this.segments, this.currentSegments, (segments: ContentSegment[]) => {
            return segments.filter((segment) => isContentSegment(segment))
                .map(({id}) => id);
        });

        let questionIds = deltaMapArrayDiff(this.segments, this.currentSegments, (segments: ContentSegment[]) => {
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

    private getOrderedContentQuestionsIds (): DeltaArrOp[] {
        return deltaArrayDiff(this.segments.map(({id}) => id), this.segments.map(({id}) => id));
    }

    private getOrderedContentIds (): DeltaArrOp[] {
        return [];
    }


    private getOrderedQuestionsIds (): DeltaArrOp[] {
        return [];
    }

    // todo finish
    getQuestionChanges (): QuestionChangesObj {
        return {};
    }

    getContentChanges (): QuillDeltaMap {
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

    isContent (obj: any): boolean {
        return obj && obj.type === 'CONTENT';
    }

    getSegments (): QuillEditorData[] {
        return this.getContents();
    }

    addContentCallback (addContentId: string) {
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

}

export const isNotEmptyQuillData = (quillData: Quill.DeltaStatic): boolean => {
    return quillData.ops.some((quillOp) => {
        // newly created quill editor will default to single line insert operation
        return quillOp.insert !== '\n';
    });
};
