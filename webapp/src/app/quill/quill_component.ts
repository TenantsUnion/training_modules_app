import {Quill, QuillOptionsStatic} from "quill";
import Vue from "vue";
import Component from "vue-class-component";

//default quill theme
require('quill/dist/quill.core.css');
require('quill/dist/quill.snow.css');

const BackgroundClass = Quill.import('attributors/class/background');
const ColorClass = Quill.import('attributors/class/color');
const SizeClass = Quill.import('attributors/style/size');
Quill.register(BackgroundClass);
Quill.register(ColorClass);
Quill.register(SizeClass);

export const QUILL_CONFIG: QuillOptionsStatic = {
    modules: {
        history: {
            delay: 1000,
            maxStack: 100,
            userOnly: true
        },
        toolbar: true
    },
    // debug: 'info',
    theme: 'snow'
};


let counter = 0;

require('./quill_component.scss');

@Component({
    data: () => {
        return {
            editorId: ''
        };
    },
    // language=HTML
    template: `
        <div class="editor-container">
            <div v-bind:class="editorId"></div>
        </div>
    `
})
export class QuillComponent extends Vue {

    editorId: string;
    quill: Quill;

    created () {
        this.editorId = 'editor-' + counter.toString();
        counter++;
    }

    mounted () {
        this.quill = new Quill('.' + this.editorId, QUILL_CONFIG)
    }

    getQuillEditorContents(): Quill.DeltaStatic {
        return this.quill.getContents();
    }
}
