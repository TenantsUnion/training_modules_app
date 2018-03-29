import Vue from "vue";
import Component from "vue-class-component";
import VueForm from "@webapp/types/vue-form";
import {appRouter} from "@webapp/app_router";
import QuillComponent from '@webapp/global/quill/quill_component';
import {ContentEntity} from "@shared/content";
import {contentHttpService} from "@webapp/user/content/content_http_service";

//todo is this still needed?
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
            content: {},
            model: {
                title: '',
            }
        };
    }
})
export default class EditUserContentComponent extends Vue {
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
    }

    done () {
        this.save();
    }

    cancel () {
        appRouter.push({name: 'content'});
    }
}