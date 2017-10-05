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
        lastModified: Moment;
        content: QuillEditorData[];
    }

    export interface ViewSectionTransferData extends ViewSectionData {
        createdAt: string;
        lastModified: string;
        orderedContentIds: string[];

    }

    interface SaveSectionData {
        id: string;
        title: string;
        description?: string;
        content: { id: string, editorJson: Quill.DeltaStatic }[];
        timeEstimate: string;
        lastModified: string;
        createdAt: string;
    }

    interface CreateSectionData {
        courseId: string;
        moduleId: string;
        title: string;
        quillData: Quill.DeltaStatic;
        description?: string;
        timeEstimate?: string;
    }
}

export = sections;