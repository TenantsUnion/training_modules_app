import {
    CreateTrainingEntityCommand, CreateTrainingEntityPayload, SaveTrainingEntityPayload,
    TrainingEntityDiffDelta, TrainingEntity, ViewTrainingEntity, ViewTrainingEntityDescription
} from './training_entity';
import {DeltaArrOp} from './delta/diff_key_array';
import {CommandType} from "@shared/entity";
import {ViewCourseStructure} from "@shared/courses";

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
    courseStructure: ViewCourseStructure;
}

export interface SaveModuleResponse {
    module: ViewModuleData;
    courseStructure: ViewCourseStructure;
}

export type CreateModuleEntityCommand = CreateTrainingEntityCommand<CommandType.module, CreateModuleEntityPayload>;
export interface SaveModuleEntityPayload extends SaveTrainingEntityPayload<ModuleEntityDiffDelta> {
    courseId: string
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
