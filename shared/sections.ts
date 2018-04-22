import {
    CreateTrainingEntityPayload, SaveTrainingEntityPayload, TrainingEntityDelta,
    TrainingEntity, TrainingView} from './training';
import {ViewCourseStructure} from "@shared/courses";

export type SectionEntity = TrainingEntity;
export interface ViewSectionData extends TrainingView {}


export interface SaveSectionEntityPayload extends SaveTrainingEntityPayload<TrainingEntityDelta> {
    courseId: string;
    moduleId: string;
}

export interface SaveSectionResponse {
    section: ViewSectionData;
    courseStructure: ViewCourseStructure;
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
    courseStructure: ViewCourseStructure;
}


