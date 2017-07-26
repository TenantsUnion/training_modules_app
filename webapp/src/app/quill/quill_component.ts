import {Quill, QuillOptionsStatic} from "quill";
import * as Vue from "vue";

require('quill/dist/quill.core.css');
require('quill/dist/quill.snow.css');

export const QUILL_CONFIG: QuillOptionsStatic = {
    modules: {
        history: {
            delay: 1000,
            maxStack: 100,
            userOnly: true
        },
        toolbar: true
    },
    debug: 'info',
    theme: 'snow'
};

let quill: Quill = new Quill('#editor', QUILL_CONFIG);

export class QuillComponent extends Vue {

}
