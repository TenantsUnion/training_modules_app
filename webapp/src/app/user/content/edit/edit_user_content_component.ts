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
            errorMsg: '',
            formstate: {},
            model: {
                title: '',
            }
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
    retrievedContent: Promise<ContentEntity>;

    created () {
        this.fetchContentData();
    }

    watch () {
        return {
            '$route': () => {
                this.fetchContentData();
                this.renderContents();
            }
        };
    }

    fetchContentData (): void {
        this.loading = true;
        this.retrievedContent = contentHttpService.loadContent(this.contentId)
            .then((content) => {
                this.loading = false;
                return content;
            })
            .catch((errorMsg) => {
                this.errorMsg = errorMsg;
                throw errorMsg;
            });
    }

    renderContents (): void {
        this.retrievedContent
            .then((content) => {
                this.title = content.title;
                this.quillDataId = content.quillDataId;
                this.quillEditor.setQuillEditorContents(content.quillData);
            });
    }

    save () {
        this.loading = true;
        contentHttpService.saveContent({
            id: this.contentId,
            title: this.title,
            quillData: this.quillEditor.getQuillEditorContents(),
            quillDataId: this.quillDataId
        }).then(() => {
            this.loading = false;
        }).catch((errorMsg) => {
            this.errorMsg = errorMsg;
        });
    }

    mounted () {
        this.quillEditor = <QuillComponent> this.$refs.editor;
        this.renderContents();
    }

    done() {

    }
}