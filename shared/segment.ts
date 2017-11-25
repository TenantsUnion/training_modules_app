import {Moment} from 'moment';

export interface Segment {
    id: string,
    type: string, //'CONTENT' | 'QUESTION',
    version?: number,
    lastModifiedAt?: Moment,
    removeCallback?: () => any;
    onChangeCallback?: (QuillChangeObj) => any;
}

export interface ContentSegment extends Segment {
    editorJson: Quill.DeltaStatic;
}

export const isContentSegment = (obj: any): obj is ContentSegment => {
    return obj && obj.type === 'CONTENT';
}
