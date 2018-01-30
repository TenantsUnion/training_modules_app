import {Moment} from 'moment';
import {
    CreateTrainingEntityPayload, SaveTrainingEntityPayload, TrainingEntityDiffDelta,
    TrainingEntity, ViewTrainingEntity, ViewTrainingEntityQuillData
} from './training_entity';
import {QuillEditorData} from './quill_editor';
import {ViewCourseTransferData} from './courses';

export type SectionEntityType = 'SectionEntity';
export type SectionEntity = TrainingEntity;

export interface SectionDetails {
    id: string;
    title: string;
    description?: string;
}

interface ViewSectionData extends ViewTrainingEntity {}

export interface ViewSectionQuillData extends ViewTrainingEntityQuillData {}

export interface ViewSectionTransferData extends ViewSectionData {}

export interface SaveSectionEntityPayload extends SaveTrainingEntityPayload<TrainingEntityDiffDelta> {
    courseId: string;
    moduleId: string;
}

export interface SaveSectionResponse {
    sectionId: string;
    moduleId: string;
    course: ViewCourseTransferData;
}

export interface CreateSectionResponse {
    sectionId: string;
    course: ViewCourseTransferData;
}

export interface CreateSectionEntityPayload extends CreateTrainingEntityPayload {
    courseId: string;
    moduleId: string;
}


