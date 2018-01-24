import * as _ from "underscore";
import Quill from "quill";
import Vue from "vue";
import Component from "vue-class-component";
import {DeltaStatic, Sources} from "quill";


const BackgroundClass = Quill.import('attributors/class/background');
const ColorClass = Quill.import('attributors/class/color');
const SizeClass = Quill.import('attributors/style/size');
Quill.register(BackgroundClass);
Quill.register(ColorClass);
Quill.register(SizeClass);

let Delta: Quill.DeltaStatic = Quill.import('delta');

// no sources prop like Quill type definition for TextChangeHandler
// since changes from the api start out in parent components and wouldn't needed to be broadcasted
export type QuillChangeEvent = {
    editorId: string;
    delta: DeltaStatic;
    oldContents: DeltaStatic;
    source: Sources
}

export type QuillChangeFn = (change: QuillChangeEvent) => any;

type EditorState = 'NEW' | 'CHANGED' | 'PRISTINE';

@Component({
    data: () => {
        return {
            // same format used to specify toolbar module config programatically via Quill constructor
            toolbarConfig: [
                ['bold', 'italic', 'underline', 'strike'],
                ['link', 'image'],
                [{'color': []}, {'background': []}],
                ['blockquote', 'code-block'],

                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                [{'direction': 'rtl'}],                         // text direction

                [{'header': [false, 1, 2, 3, 4, 5, 6]}],

                [{'font': []}],
                [{'align': []}]
            ]
        };
    },
    props: {
        readOnly: {
            type: Boolean,
        },
        editorId: {
            required: true,
            type: [String, Number]
        },
        editorJson: {
            type: Object,
            default: () => new Delta()
        },
        onChange: {
            type: Function,
            required: false,
            default: null
        },
        onRemove: {
            type: Function
        }
    },
})
export default class QuillComponent extends Vue {
    editorId: string;
    editorJson: DeltaStatic;
    quill: Quill.Quill;
    readOnly: boolean;
    onChange: QuillChangeFn;
    onRemove: () => {};
    changes: Quill.DeltaStatic = new Delta();

    mounted() {
        this.quill = new Quill(<Element> this.$refs.editor, {
                modules: {
                    history: {
                        delay: 1000,
                        maxStack: 100,
                        userOnly: true
                    },
                    toolbar: this.readOnly ? false : this.$refs.toolbar,
                },
                debug: process.env.NODE_ENV === 'debug' ? 'info' : undefined,
                readOnly: this.readOnly,
                theme: 'snow'
            }
        );

        // track changes that have been made in order to save later
        this.quill.on('text-change', (delta: DeltaStatic, oldContents: DeltaStatic, source: Sources) => {
            if (source === 'user') {
                this.changes = this.changes.compose(delta);
            }
        });

        this.editorJson && this.quill.setContents(new Delta(this.editorJson.ops), 'api');
    }

    getQuillEditorContents(): Quill.DeltaStatic {
        return this.quill.getContents();
    }

    getChanges(): Quill.DeltaStatic {
        return this.changes;
    }
    /**
     * Indicates that quill editor should be displayed if not in read only mode or the quill content is not
     * the initial blank state of an empty quill Editor
     */
    get displayQuillEditor(): boolean {
        return !this.readOnly ||
            (this.editorJson && _.isArray(this.editorJson.ops) &&
                (this.editorJson.ops.length > 1 || this.editorJson.ops[0] !== '\n'));
    }

    isBtnObj(obj: any): boolean {
        return _.isObject(obj) && Object.keys(obj).length === 1
            && Object.keys(obj).every((key) => !_.isArray(obj[key])) // dropdown would have array of possible values
    }

    formatObjVal(obj: any): string {
        return Object.keys(obj).map((key) => obj[key])
            .find((val) => val);
    }

    formatObjProp(obj: any): string {
        return Object.keys(obj).find((key) => !!key);
    }

    isDropdownObj(obj: any) {
        return _.isObject(obj) && Object.keys(obj).length === 1
            && Object.keys(obj).every((key) => _.isArray(obj[key]))
            && Object.keys(obj).reduce((key) => obj[key]);
    }
}
