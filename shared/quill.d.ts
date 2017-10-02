import {Moment} from 'moment';

declare namespace quill {

    export interface QuillEditorData {
        id: string;
        editorJson: Quill.DeltaStatic;
        lastModified: Moment | string;
    }
}

export = quill;
