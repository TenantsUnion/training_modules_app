import {ContentData} from "./content";
import {QuillEditorData} from "../server/src/quill/quill_repository";

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

    interface CreateModuleData {
        courseId: string;
        title: string;
        header?: Quill.DeltaStatic;
        description?: string;
        timeEstimate: string;
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