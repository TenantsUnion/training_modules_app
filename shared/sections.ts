import {Moment} from 'moment';
import {CreateTrainingEntityPayload, TrainingEntity, TrainingEntityPayload} from './training_entity';
import {QuillEditorData} from 'quill_editor.ts';
import {ViewCourseTransferData} from './courses';

export type SectionEntityType = 'SectionEntity';
export type SectionEntity = TrainingEntityPayload;

export interface SectionDetails {
    id: string;
    title: string;
    description?: string;
}

interface ViewSectionData {
    id: string;
    title: string;
    description: string;
    timeEstimate: string;
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


export interface SaveSectionData {
    id: string;
    courseId: string;
    moduleId: string;
    title: string;
    description?: string;
    content: { id: string, editorJson: Quill.DeltaStatic }[];
    timeEstimate: string;
}

export interface CreateSectionResponse {
    sectionId: string;
    course: ViewCourseTransferData;
}

export interface CreateSectionEntityPayload extends CreateTrainingEntityPayload {
    courseId: string;
    moduleId: string;
}


