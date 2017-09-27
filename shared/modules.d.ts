import {SectionData} from 'sections';
import {QuillEditorData} from './quill';

declare namespace modules {

    interface ModuleData {
        id: string;
        header?: QuillEditorData
        title: string;
        description?: string;
        timeEstimate?: string;
        lastEdited: string;
        sections: SectionData[]
        active: boolean;
    }

    interface CreateModuleData {
        courseId: string;
        title: string;
        header?: Quill.DeltaStatic;
        description?: string;
        timeEstimate?: string;
        active?: boolean;
    }

    interface CreateModuleDataHeaderId extends CreateModuleData {
        headerContentId: string;
    }


    interface AdminModuleData extends ModuleData {
    }

    interface ModuleDetails {
        id: string;
        title: string;
        description?: string;
    }
}

export = modules;