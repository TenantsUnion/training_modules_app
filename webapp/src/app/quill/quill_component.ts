import {Quill, QuillOptionsStatic, DeltaStatic} from "quill";
import Vue from "vue";
import Component from "vue-class-component";
//compression library for images
import LZString from "lz-string";
import * as _ from "underscore";


//default quill theme
require('quill/dist/quill.core.css');
require('quill/dist/quill.snow.css');

const BackgroundClass = Quill.import('attributors/class/background');
const ColorClass = Quill.import('attributors/class/color');
const SizeClass = Quill.import('attributors/style/size');
Quill.register(BackgroundClass);
Quill.register(ColorClass);
Quill.register(SizeClass);

let Delta = Quill.import('delta');

export const QUILL_CONFIG: QuillOptionsStatic = {
    modules: {
        history: {
            delay: 1000,
            maxStack: 100,
            userOnly: true
        },
        toolbar: [
            [{header: [1, 2, false]}],
            ['bold', 'italic', 'underline'],
            ['image', 'background', 'color']
        ]
    },
    debug:  process.env.NODE_ENV === 'debug' ? 'info' : undefined,
    theme: 'snow'
};


let counter = 0;

require('./quill_component.scss');

@Component({
    data: () => {
        return {
            editorId: '',
            scrollingContainerId: ''
        };
    },
    // language=HTML
    template: `
            <div v-bind:class="scrollingContainerId" class="scrolling-container">
                <div v-bind:class="editorId" class="editor-container"></div>
            </div>
    `
})
export class QuillComponent extends Vue {

    editorId: string;
    scrollingContainerId: string;
    quill: Quill;

    created () {
        this.editorId = 'editor-' + counter.toString();
        counter++;
    }

    mounted () {
        this.quill = new Quill('.' + this.editorId, QUILL_CONFIG)
    }

    getQuillEditorContents (): Quill.DeltaStatic {
        return this.quill.getContents();
    }

    setQuillEditorContents (quillContents: Quill.DeltaStatic) {
        this.quill.setContents(quillContents);
    }
}
