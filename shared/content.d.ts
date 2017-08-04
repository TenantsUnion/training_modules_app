declare namespace content {
    export interface CreateUserContentCommand {
        userId: string;
        title: string;
        quillContent: string;
    }
}

export = content;