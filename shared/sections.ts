import {
    CreateTrainingEntityPayload, SaveTrainingEntityPayload, TrainingEntityDiffDelta,
    TrainingEntity, ViewTrainingEntity, ContentQuestionsDelta
} from './training_entity';
import {ViewCourseDelta} from '@shared/courses';
import {ViewModuleDelta} from '@shared/modules';

export type SectionEntityType = 'SectionEntity';
export type SectionEntity = TrainingEntity;

export interface SectionDetails {
    id: string;
    title: string;
    description?: string;
}

export interface ViewSectionData extends ViewTrainingEntity {}


export interface SaveSectionEntityPayload extends SaveTrainingEntityPayload<TrainingEntityDiffDelta> {
    courseId: string;
    moduleId: string;
}

export interface SaveSectionResponse {
    courseId: string;
    moduleId: string;
    sectionId: string;
    course: ViewCourseDelta;
    module: ViewModuleDelta;
}

export interface CreateSectionResponse {
    sectionId: string;
    course: ViewCourseDelta;
    module: ViewModuleDelta;
}

export interface CreateSectionEntityPayload extends CreateTrainingEntityPayload {
    courseId: string;
    moduleId: string;
}


