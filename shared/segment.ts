export interface Segment {
    id: string,
    type: 'CONTENT' | 'QUESTION',
    version?: string,
    lastModifiedAt?: Date,
    removeCallback?: () => any;
    onChangeCallback?: (QuillChangeObj) => any;
}

export interface ContentSegment extends Segment {
    editorJson: Quill.DeltaStatic;
}

export const isContentSegment = (obj: any): obj is ContentSegment => {
    return obj && obj.type === 'CONTENT';
}
