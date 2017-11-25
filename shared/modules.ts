import {Moment} from 'moment';
import {SectionEntity, ViewSectionTransferData} from "sections.ts";
import {QuillEditorData} from 'quill_editor.ts';
import {
    CreateTrainingEntityCommand, CreateTrainingEntityPayload, SaveTrainingEntityCommand, TrainingEntity,
    TrainingEntityDiffDelta
} from './training_entity';
import {DeltaArrDiff} from './delta/delta';

export type ModuleEntityType = 'ModuleEntity';
export interface ViewModuleData {
    id: string;
    title: string;
    description?: string;
    timeEstimate?: string;
    active: boolean;
}

export interface ViewModuleQuillData extends ViewModuleData {
    headerContent: QuillEditorData
    lastModifiedAt: Moment;
    sections: ViewSectionTransferData[]
}

export interface ViewModuleTransferData extends ViewModuleData {
    headerContent: string;
    lastModifiedAt: string;
    sections: ViewSectionTransferData[]
}

export interface ModuleEntity extends TrainingEntity<ModuleEntityType> {
    orderedSectionIds: string[]
    sections: SectionEntity[]
    fieldDeltas: ModuleEntityDeltas,
}

export interface ModuleEntityDeltas extends TrainingEntityDiffDelta {
    orderedSectionIds?: DeltaArrDiff;
}

export interface CreateModuleEntityPayload extends CreateTrainingEntityPayload{
    courseId: string;
    active?: boolean;
}

export type CreateModuleEntityCommand = CreateTrainingEntityCommand<ModuleEntityType, CreateModuleEntityPayload>;
export type SaveModuleEntityCommand = SaveTrainingEntityCommand<ModuleEntityType, ModuleEntityDeltas>;

export interface SaveModuleData extends ViewModuleData {
    courseId: string;
    headerContent: Quill.DeltaStatic;
    headerContentId: string;
    orderedSectionIds: string[],
    removeSectionIds: string[]
}

export interface ModuleDetails {
    id: string;
    title: string;
    description?: string;
}

