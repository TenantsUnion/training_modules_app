import Vue from "vue";
import Component from 'vue-class-component';
import {isDeltaStatic} from '../../../../../shared/delta/typeguards_delta';
import {QuillDeltaMap, QuillEditorData} from "quill_editor.ts";
import {QuillComponent} from '../quill/quill_component';
import {ContentSegment, Segment} from '../../../../../shared/segment';


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
            <div v-for="(segment, index) in segments">
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

    getContentChanges(): QuillDeltaMap {
        let contentData = (<QuillComponent[]> this.$refs.contentEditor).reduce((acc, editor) => {
            acc[editor.editorId] = editor.getChanges();
            return acc;
        }, {});
        return contentData;
    }

    isContent(obj: any): boolean {
        return obj && obj.type === 'CONTENT';
    }

    getSegments(): QuillEditorData[] {
        return this.getContents();
    }
}