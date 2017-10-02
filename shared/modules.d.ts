import {ViewSectionQuillData, ViewSectionTransferData} from 'sections';
import {QuillEditorData} from './quill';
import {Moment} from 'moment';

declare namespace modules {
    interface ViewModuleData {
        id: string;
        title: string;
        description?: string;
        timeEstimate?: string;
        active: boolean;
    }

    interface ViewModuleQuillData extends ViewModuleData {
        headerContent: QuillEditorData
        lastModified: Moment;
        sections: ViewSectionTransferData[]
    }

    interface ViewModuleTransferData extends ViewModuleData {
        headerContent: string;
        lastModified: string;
        sections: ViewSectionTransferData[]
    }

    interface CreateModuleData {
        courseId: string;
        title: string;
        header?: Quill.DeltaStatic;
        description?: string;
        timeEstimate?: string;
        active?: boolean;
    }

    interface SaveModuleData extends CreateModuleData {
        moduleId: string;
        orderedSectionIds: string[]
    }

    interface ModuleDetails {
        id: string;
        title: string;
        description?: string;
    }
}

export = modules;