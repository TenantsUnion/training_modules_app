import {QuillEditorData} from "../server/src/quill/quill_repository";
import {ContentData} from "./content";

declare namespace modules {

    interface ModuleData {
        id: string;
        header?: QuillEditorData
        title: string;
        description?: string;
        time_estimate?: string;
        lastEdited: string;
        sections?: SectionData[]
    }

    interface AdminModuleData extends ModuleData {
        active: boolean;
    }

    interface ModuleDetails {
        id: string;
        title: string;
        description: string;
    }

    interface SectionData {
        id: string;
        header: QuillEditorData;
        title: string;
        description: string
        content: ContentData[]
    }

    interface SectionDetails {
        id: string;
        title: string;
        description: string;
    }
}

export = modules;