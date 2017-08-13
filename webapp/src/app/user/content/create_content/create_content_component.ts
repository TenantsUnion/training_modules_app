import Vue from "vue";
import Component from "vue-class-component";
import {QuillComponent} from "../../../quill/quill_component";
import {contentHttpService} from "../content_http_service";

@Component({
    data: () => {
        return {
            loading: false,
            errorMessages: {},
            title: '',
            formstate: {}
        };
    },
    template: require('./create_content_component.tpl.html'),
    components: {
        'quill-editor': QuillComponent
    }
})
export class CreateContentComponent extends Vue {
    errorMessages: object;
    loading: boolean;
    title: string;
    quillEditor: QuillComponent;

    mounted () {
        this.quillEditor = <QuillComponent> this.$refs.editor;
    }

    create () {
        let quillData: Quill.DeltaStatic = this.quillEditor.getQuillEditorContents();
        contentHttpService.createContent(this.title, quillData)
            .then(() => {
                //successfully created content
            })
            .catch((errorMessages) => {
                this.errorMessages = errorMessages;
            });
    }
}