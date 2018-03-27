// deprecated was for proof of concept with quill
import {QuillEditorData} from '@shared/quill_editor';
import {DeltaStatic} from "quill";

export interface CreateUserContentCommand {
    userId: string;
    title: string;
    quillContent: DeltaStatic;
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
    quillData: QuillEditorData,
    title: string,
    tags?: string[],
    lastModifiedAt?: string,
    createdAt?: string
}
