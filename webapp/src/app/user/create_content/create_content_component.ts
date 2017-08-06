import Vue from "vue";
import Component from "vue-class-component";
import {QuillComponent} from "../../quill/quill_component";

@Component({
    data: () => {
        return {
            loading: false,
            errorMsg: '',
            title: ''
        };
    },
    template: require('./create_content_component.tpl.html'),
    components: {
        'quill-editor': QuillComponent
    }
})
export class ContentComponent extends Vue {

    create () {

    }
}