import {QuillEditorData} from './quill';
import {Moment} from 'moment';

declare namespace sections {
    interface SectionDetails {
        id: string;
        title: string;
        description?: string;
    }

    interface ViewSectionData {
        id: string;
        title: string;
        description: string;
        timeEstimate: string;
    }

    export interface ViewSectionQuillData extends ViewSectionData {
        createdAt: Moment;
        lastModifiedAt: Moment;
        content: QuillEditorData[];
    }

    export interface ViewSectionTransferData extends ViewSectionData {
        createdAt: string;
        lastModifiedAt: string;
        orderedContentIds: string[];

    }

    interface SaveSectionData {
        id: string;
        courseId: string;
        moduleId: string;
        title: string;
        description?: string;
        content: { id: string, editorJson: Quill.DeltaStatic }[];
        timeEstimate: string;
    }

    interface CreateSectionData {
        courseId: string;
        moduleId: string;
        title: string;
        content: Quill.DeltaStatic;
        description?: string;
        timeEstimate?: string;
    }
}

export = sections;