import Vue from "vue";
import Component from "vue-class-component";
import {contentHttpService} from "../content_http_service";
import {appRouter} from "../../../router";
import QuillComponent from '../../../global/quill/quill_component';
import {QuillEditorData} from '@shared/quill_editor';


@Component({
    data: () => {
        return {
            loading: false,
            errorMessages: {},
            title: '',
            formstate: {}
        };
    },
    template: require('./create_content_component.tpl.html')
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
        let quillData: QuillEditorData = this.quillEditor.getQuillEditorContents();
        contentHttpService.createContent(this.title, quillData)
            .then(() => {
                //successfully created content
            }).then(() => {
            appRouter.push({name: `content`})
            }).catch((errorMessages) => {
                this.errorMessages = errorMessages;
            });
    }

    cancel () {
        appRouter.push({name: 'content'});
    }
}