import Quill from "quill";
import {QuillOptionsStatic, DeltaStatic} from "quill";
import Vue from "vue";
import Component from "vue-class-component";
import {Watch} from 'vue-property-decorator';

//default quill theme
require('quill/dist/quill.core.css');
require('quill/dist/quill.snow.css');

const BackgroundClass = Quill.import('attributors/class/background');
const ColorClass = Quill.import('attributors/class/color');
const SizeClass = Quill.import('attributors/style/size');
Quill.register(BackgroundClass);
Quill.register(ColorClass);
Quill.register(SizeClass);

let Delta: Quill.DeltaStatic = Quill.import('delta');
let counter = 0;

const BLANK_QUILL_OP: Quill.DeltaOperation = {
    insert: '\n'
};

@Component({
    data: () => {
        return {
            editorId: '',
            quill: null
        };
    },
    props: {
        readOnly: {
            type: Boolean,
            default: false
        },
        editorJson: Object
    },
    // language=HTML
    template: `
        <div v-show="displayQuillEditor" class="scrolling-container">
            <div v-bind:class="editorId" class="editor-container"></div>
        </div>
    `
})
export class QuillComponent extends Vue {

    editorId: string;
    editorJson: Quill.DeltaStatic;
    quill: Quill.Quill;
    readOnly: boolean;
    delta = Delta;

    created() {
        this.editorId = 'editor-' + counter.toString();
        counter++;
    }

    mounted() {
        this.quill = new Quill(`.${this.editorId}`, {
                modules: {
                    history: {
                        delay: 1000,
                        maxStack: 100,
                        userOnly: true
                    },
                    toolbar: this.readOnly ? false : [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['image', {'color': []}, {'background': []}],
                        ['blockquote', 'code-block'],

                        [{'list': 'ordered'}, {'list': 'bullet'}],
                        [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                        [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                        [{'direction': 'rtl'}],                         // text direction

                        [{'header': [1, 2, 3, 4, 5, 6, false]}],

                        [{'font': []}],
                        [{'align': []}],

                    ]

                },
                debug: process.env.NODE_ENV === 'debug' ? 'info' : undefined,
                readOnly: this.readOnly,
                theme: 'snow'
            }
        );


        this.editorJson && this.quill.setContents(new Delta(this.editorJson.ops));
    }

    getQuillEditorContents(): Quill.DeltaStatic {
        return this.quill.getContents();
    }

    setQuillEditorContents(quillContents: Quill.DeltaStatic) {
        this.editorJson = quillContents;
    }

    @Watch('editorJson', {immediate: true})
    updateQuillEditorContents(newQuill: Quill.DeltaStatic, oldQuill: Quill.DeltaStatic) {
        newQuill && this.quill.setContents(new Delta(this.editorJson.ops))

    }


    /**
     * Indicates that quill editor should be displayed if not in read only mode or the quill content is not
     * the initial blank state of an empty quill Editor
     */
    get displayQuillEditor(): boolean {
        return !this.readOnly ||
            (this.quill && (this.quill.getContents().ops.length > 1 ||
                //empty quill editor initialized with single insert operation of new line
                this.quill.getContents().ops[0].insert !== "\n"));
    }
}
