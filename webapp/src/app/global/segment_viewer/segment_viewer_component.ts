import Vue from "vue";
import Component from 'vue-class-component';
import {QuillDeltaMap, QuillEditorData} from "quill_editor.ts";
import {QuillComponent} from '../quill/quill_component';
import {ContentSegment, isContentSegment, Segment} from '../../../../../shared/segment';
import {QuillContentObj} from '../../../../../shared/delta/delta';
import {diffQuillContentObj} from '../../../../../shared/delta/diff_delta';


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

    getContentChanges(): QuillDeltaMap {
        let userChangedEditor: QuillComponent[] = this.$refs.contentEditor ? <QuillComponent[]> this.$refs.contentEditor : [];
        let userChangedContent: QuillContentObj = userChangedEditor.reduce((acc, editor) => {
            acc[editor.editorId] = editor.getQuillEditorContents();
            return acc;
        }, {});
        let storedContent: ContentSegment[] = <ContentSegment[]> this.segments
            .filter((segment) => isContentSegment(segment));
        let storedContentObj: QuillContentObj = storedContent.reduce((acc, content) => {
            acc[content.id] = content.editorJson;
            return acc;
        }, {});
        return diffQuillContentObj(storedContentObj, userChangedContent);
    }

    isContent(obj: any): boolean {
        return obj && obj.type === 'CONTENT';
    }

    getSegments(): QuillEditorData[] {
        return this.getContents();
    }
}