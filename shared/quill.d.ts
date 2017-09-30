import {Moment} from 'moment';

export interface QuillEditorData {
    id: string;
    editor_json?: Quill.DeltaStatic;
    lastModified: Moment;
}
