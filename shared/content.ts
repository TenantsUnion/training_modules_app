// deprecated was for proof of concept with quill
export interface CreateUserContentCommand {
    userId: string;
    title: string;
    quillContent: Quill.DeltaStatic;
}

export interface ContentData {
    id: string;
    quillDataId: string;
    title?: string;
    tags?: string[],
    lastModifiedAt?: string,
    createdAt?: string
}

export interface ContentEntity {
    id: string,
    quillDataId: string,
    quillData: Quill.DeltaStatic,
    title: string,
    tags?: string[],
    lastModifiedAt?: string,
    createdAt?: string
}
