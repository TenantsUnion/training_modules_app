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
        content: { id: string, editorJson: Quill.DeltaStatic }[];
    }

    interface SectionLoadingContentId {

    }

    interface SectionContentData {

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