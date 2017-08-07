import Vue from "vue";
import Component from "vue-class-component";
import {QuillComponent} from "../../../quill/quill_component";
import {contentHttpService} from "../content_http_service";
import {ContentEntity} from "../../../../../../server/src/content/content_repository";

@Component({
    props: {
        contentId: String
    },
    data: () => {
        return {
            title: '',
            loading: false,
            errorMsg: ''
        };
    },
    components: {
        'quill-editor': QuillComponent
    },
    template: require('./edit_user_content_component.tpl.html')
})
export class EditUserContentComponent extends Vue {
    loading: boolean;
    errorMsg: string;
    contentId: string;
    quillDataId: string;
    title: string;
    quillEditor: QuillComponent;
    retrievingContent: Promise<ContentEntity>;

    created() {
        this.fetchContentData();
    }

    fetchContentData () {
        this.loading = true;
        this.retrievingContent = contentHttpService.loadContent(this.contentId);
    }

    save () {
        contentHttpService.saveContent({
            id: this.contentId,
            title: this.title,
            quillData: this.quillEditor.getQuillEditorContents(),
            quillDataId: this.quillDataId
        }).then(() => {

        });
    }

    mounted () {
        this.quillEditor = <QuillComponent> this.$refs.editor;
        this.retrievingContent.then((content) => {
            this.loading = false;
            this.title = content.title;
            this.quillDataId = content.quillDataId;
            this.quillEditor.setQuillEditorContents(content.quillData);
        });
    }
}