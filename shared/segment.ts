import {QuestionQuillData} from "@shared/questions";
import {QuillEditorData} from '@shared/quill_editor';

export interface Segment {
    id: string,
    type: 'CONTENT' | 'QUESTION',
}

export interface ContentSegment extends Segment {
    type: 'CONTENT';
    content: QuillEditorData;
}

export interface QuestionSegment extends Segment {
    type: 'QUESTION';
    question: QuestionQuillData
}

export interface SegmentArrayElement {
    removeCallback?: () => any;
}

export const isContentSegment = (obj: any): obj is ContentSegment => {
    return obj && obj.type === 'CONTENT';
};

export const isQuestionSegment = (obj: any): obj is QuestionSegment => {
    return obj && obj.type === 'QUESTION';
};

