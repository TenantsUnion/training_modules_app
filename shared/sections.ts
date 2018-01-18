import {Moment} from 'moment';
import {
    CreateTrainingEntityPayload, SaveTrainingEntityPayload, TrainingEntityDiffDelta,
    TrainingEntity, ViewTrainingEntity
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

interface ViewSectionData extends ViewTrainingEntity{
    id: string;
    title: string;
    description: string;
    timeEstimate: string;
    orderedContentIds: string[];
    orderedQuestionIds: string[];
    orderedContentQuestionIds: string[];
}

export interface ViewSectionQuillData extends ViewSectionData {
    createdAt: Moment;
    lastModifiedAt: Moment;
    content: QuillEditorData[];
}

export interface ViewSectionTransferData extends ViewSectionData {
    createdAt: string;
    lastModifiedAt: string;
    orderedContentIds: string[];
}

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


