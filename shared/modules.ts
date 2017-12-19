import {SectionEntity, ViewSectionTransferData} from "sections.ts";
import {
    CreateTrainingEntityCommand, CreateTrainingEntityPayload, SaveTrainingEntityCommand, TrainingEntity,
    TrainingEntityDiffDelta, TrainingEntityPayload, ViewTrainingEntityQuillData, ViewTrainingEntityTransferData
} from './training_entity';
import {DeltaArrDiff} from './delta/diff_key_array';
import {ViewCourseTransferData} from './courses';

export type ModuleEntityType = 'ModuleEntity';

export interface ViewModuleQuillData extends ViewTrainingEntityQuillData {
    sections: ViewSectionTransferData[]
}

export interface ViewModuleTransferData extends ViewTrainingEntityTransferData {
    sections: ViewSectionTransferData[],
}

export interface ModuleEntity extends TrainingEntityPayload {
    orderedSectionIds: string[]
    sections: SectionEntity[]
    fieldDeltas: ModuleEntityDeltas,
}

export interface ModuleEntityDeltas extends TrainingEntityDiffDelta {
    orderedSectionIds?: DeltaArrDiff;
}

export interface CreateModuleEntityPayload extends CreateTrainingEntityPayload {
    courseId: string;
    active?: boolean;
}

export interface CreateModuleResponse {
    moduleId: string;
    course: ViewCourseTransferData;
}

export type CreateModuleEntityCommand = CreateTrainingEntityCommand<ModuleEntityType, CreateModuleEntityPayload>;
export type SaveModuleEntityCommand = SaveTrainingEntityCommand<ModuleEntityType, ModuleEntityDeltas>;

export interface SaveModuleData extends ViewModuleTransferData{
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

