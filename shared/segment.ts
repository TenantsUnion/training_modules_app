import {QuestionQuillData} from "@shared/questions";

export interface Segment {
    id: string,
    type: 'CONTENT' | 'QUESTION',
    lastModifiedAt?: Date,
}

export interface ContentSegment extends Segment {
    type: 'CONTENT';
    editorJson: Quill.DeltaStatic;
}

export interface QuestionSegment extends Segment {
    type: 'QUESTION';
    question: QuestionQuillData
}

export interface SegmentArrayElement {
    removeCallback?: () => any;
    onChangeCallback?: (QuillChangeObj) => any;
}

export const isContentSegment = (obj: any): obj is ContentSegment => {
    return obj && obj.type === 'CONTENT';
};

export const isQuestionSegment = (obj: any): obj is QuestionSegment => {
    return obj && obj.type === 'QUESTION';
};

