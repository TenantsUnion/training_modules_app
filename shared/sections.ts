import {
    CreateTrainingEntityPayload, SaveTrainingEntityPayload, TrainingEntityDiffDelta,
    TrainingEntity, ViewTrainingEntity, ContentQuestionsDelta, ViewTrainingEntityDescription
} from './training_entity';
import {ViewModuleDescription} from '@shared/modules';

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
    section: ViewSectionData
    courseModuleDescriptions: ViewModuleDescription[];
    moduleSectionDescriptions: ViewTrainingEntityDescription[];
}

export interface CreateSectionEntityPayload extends CreateTrainingEntityPayload {
    courseId: string;
    moduleId: string;
}

/**
 * Map of the placeholder ids to their database sequence id correspondents when a section is created.
 */
export interface SectionIdMap {
    sectionId: string,
    [p: string]: string
}

export interface CreateSectionResponse {
    sectionId: string;
    section: ViewSectionData;
    moduleSectionDescriptions: ViewTrainingEntityDescription[];
    courseModuleDescriptions: ViewModuleDescription[];
}


