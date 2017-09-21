import {QuillEditorData} from '../server/src/quill/quill_repository';
import {ContentData} from './content';

declare namespace sections {
    interface SectionDetails {
        id: string;
        title: string;
        description?: string;
    }

    interface SectionData {
        id: string;
        title: string;
        description?: string;
        orderedContentIds: string[];
        timeEstimate: string;
        lastModified: string;
        createdAt: string;
    }

    interface SaveSectionData {
        id: string;
        title: string;
        description?: string;
        content: {id: string, editorJson:Quill.DeltaStatic}[];
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
        quillContentId?: string;
        timeEstimate?: string;
    }
}

export = sections;