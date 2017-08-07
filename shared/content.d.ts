declare namespace content {
    export interface CreateUserContentCommand {
        userId: string;
        title: string;
        quillContent: string;
    }

    export interface ContentDescriptionEntity {
        id: string;
        quillDataId: string;
        title: string;
        tags?: string[],
        lastModifiedAt?: string,
        createdAt?: string
    }
}

export = content;