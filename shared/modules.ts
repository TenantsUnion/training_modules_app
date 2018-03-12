import {
    CreateTrainingEntityCommand, CreateTrainingEntityPayload, SaveTrainingEntityPayload,
    TrainingEntityDiffDelta, TrainingEntity, ViewTrainingEntity, ViewTrainingEntityDescription
} from './training_entity';
import {DeltaArrOp} from './delta/diff_key_array';
import {CommandType} from "@shared/entity";

export type ModuleEntityType = 'ModuleEntity';

export interface ViewModuleData extends ViewTrainingEntity {
    sections: ViewTrainingEntityDescription[]
}

export interface ModuleEntity extends TrainingEntity {
    headerDataId: string;
    orderedSectionIds: string[]
}

export interface ModuleEntityDiffDelta extends TrainingEntityDiffDelta {
    orderedSectionIds?: DeltaArrOp<string>[];
}

export interface CreateModuleEntityPayload extends CreateTrainingEntityPayload {
    courseId: string;
    active: boolean;
}

export interface CreateModuleResponse {
    moduleId: string;
    module: ViewModuleData;
    courseModuleDescriptions: ViewModuleDescription[];
}

export interface SaveModuleResponse {
    module: ViewModuleData;
    courseModuleDescriptions: ViewModuleDescription[];
}

export type CreateModuleEntityCommand = CreateTrainingEntityCommand<CommandType.module, CreateModuleEntityPayload>;

export interface SaveModuleEntityPayload extends SaveTrainingEntityPayload<ModuleEntityDiffDelta> {
    courseId: string
}

export interface ModuleDetails {
    id: string;
    title: string;
    description?: string;
}


export interface ViewModuleDelta extends TrainingEntityDiffDelta {
    // replace, add, update, remove changes that happen to sections in the module
    sections: DeltaArrOp<ViewTrainingEntityDescription>[];
}

export interface ViewModuleDescription extends ViewTrainingEntityDescription {
    sections: ViewTrainingEntityDescription[]
}

export interface ModuleEntityDiffDelta extends TrainingEntityDiffDelta {
    sections?: DeltaArrOp<string>[];
}

/**
 * Map of the placeholder ids to their database sequence id correspondents when a module is created.
 */
export interface CreateModuleIdMap {
    moduleId: string,
    [p: string]: string
}
