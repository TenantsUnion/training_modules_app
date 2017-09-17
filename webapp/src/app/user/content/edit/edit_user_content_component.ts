import Vue from "vue";
import Component from "vue-class-component";
import {QuillComponent} from "../../../quill/quill_component";
import {contentHttpService} from "../content_http_service";
import {ContentEntity} from "../../../../../../server/src/content/content_repository";
import * as VueForm from "../../../vue-form";
import {appRouter} from "../../../router";

@Component({
    props: {
        contentId: String
    },
    data: () => {
        return {
            title: '',
            loading: false,
            errorMessages: '',
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
    errorMessages: object;
    loading: boolean;
    contentId: string;
    quillDataId: string;
    title: string;
    formstate: VueForm.FormState;
    quillEditor: QuillComponent;
    retrievedContent: Promise<ContentEntity>;

    created () {
        this.fetchContentData();
    }

    fetchContentData (): void {
        this.loading = true;
        this.retrievedContent = contentHttpService.loadContent(this.contentId)
            .then((content) => {
                this.loading = false;
                return content;
            })
            .catch((errorMessages) => {
                return this.errorMessages = errorMessages;
            });
    }

    save () {
        this.formstate._submit();
        if (this.formstate.$invalid) {
            return;
        }
        this.loading = true;
        return contentHttpService.saveContent({
            id: this.contentId,
            title: this.title,
            quillData: this.quillEditor.getQuillEditorContents(),
            quillDataId: this.quillDataId
        }).then(() => {
            this.loading = false;
        }).then(() => {
            appRouter.push({name: `content`})
        }).catch((errorMessages) => {
            this.errorMessages = errorMessages;
        });
    }

    mounted () {
        this.quillEditor = <QuillComponent> this.$refs.editor;
        this.retrievedContent
            .then((content) => {
                this.title = content.title;
                this.quillDataId = content.quillDataId;
                this.quillEditor.setQuillEditorContents(content.quillData);
            });
    }

    done () {
        this.save();
    }

    cancel () {
        appRouter.push({name: 'content'});
    }
}