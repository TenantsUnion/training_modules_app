import {
    CreateTrainingEntityCommand, CreateTrainingEntityPayload, SaveTrainingEntityPayload,
    TrainingEntityDiffDelta, TrainingEntity, ViewTrainingEntity, ViewTrainingEntityDescription, ContentQuestionsDelta
} from './training_entity';
import {DeltaArrOp} from './delta/diff_key_array';
import {ViewCourseDelta, ViewCourseData} from '@shared/courses';

export type ModuleEntityType = 'ModuleEntity';

export interface ViewModuleData extends ViewTrainingEntity {
    sections: ViewTrainingEntityDescription[]
}

export interface ModuleEntity extends TrainingEntity {
    headerDataId: string;
    orderedSectionIds: string[]
}

export interface ModuleEntityDiffDelta extends ContentQuestionsDelta {
    orderedSectionIds?: DeltaArrOp<string>[];
}

export interface CreateModuleEntityPayload extends CreateTrainingEntityPayload {
    courseId: string;
    active: boolean;
}

export interface CreateModuleResponse {
    moduleId: string;
    module: ViewModuleData;
    course: ViewCourseDelta;
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
    courseId: string;
    moduleId: string;
    course: ViewCourseDelta;
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
