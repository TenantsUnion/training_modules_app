import {ViewSectionQuillData, ViewSectionTransferData} from "./sections";
import {
    CreateTrainingEntityCommand, CreateTrainingEntityPayload, SaveTrainingEntityCommand, SaveTrainingEntityPayload,
    TrainingEntityDiffDelta, TrainingEntity, ViewTrainingEntityQuillData, ViewTrainingEntityTransferData,
    ViewTrainingEntity
} from './training_entity';
import {DeltaArrOp} from './delta/diff_key_array';
import {ViewCourseTransferData} from './courses';

export type ModuleEntityType = 'ModuleEntity';

export interface ViewModuleData<T extends ViewTrainingEntity> extends ViewTrainingEntity {
    orderedSectionIds: string[]
    sections: T[]
}

export interface ViewModuleQuillData extends ViewModuleData<ViewSectionQuillData>, ViewTrainingEntityQuillData {}
export interface ViewModuleTransferData extends ViewModuleData<ViewSectionTransferData>, ViewTrainingEntityTransferData {}

export interface ModuleEntity extends TrainingEntity {
    headerDataId: string;
    orderedSectionIds: string[]
}

export interface ModuleEntityDiffDelta extends TrainingEntityDiffDelta {
    orderedSectionIds?: DeltaArrOp[];
}

export interface CreateModuleEntityPayload extends CreateTrainingEntityPayload {
    courseId: string;
    active: boolean;
}

export interface CreateModuleResponse {
    moduleId: string;
    course: ViewCourseTransferData;
}

export type CreateModuleEntityCommand = CreateTrainingEntityCommand<ModuleEntityType, CreateModuleEntityPayload>;

export interface SaveModuleEntityPayload extends SaveTrainingEntityPayload<ModuleEntityDiffDelta> {
    courseId: string
}

export interface ModuleDetails {
    id: string;
    title: string;
    description?: string;
}

export interface SaveModuleResponse {
    moduleId: string;
    course: ViewCourseTransferData;
}

