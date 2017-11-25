import {Moment} from "moment";
import {ModuleEntity, ViewModuleTransferData} from 'modules.ts';
import {ContentSegment} from './segment';
import {
    CreateTrainingEntityCommand, CreateTrainingEntityPayload, SaveTrainingEntityCommand, TrainingEntityDiffDelta,
    TrainingEntityPayload
} from './training_entity';
import {EntityCommandMetaData} from './entity';
import {DeltaArrDiff} from './delta/delta';

export type CourseEntityType = 'CourseEntity';
export type CreateCourseEntityCommand = CreateTrainingEntityCommand<CourseEntityType, CreateCourseEntityPayload>;
export type SaveCourseEntityCommand = SaveTrainingEntityCommand<CourseEntityType, CourseEntityDeltas>;

export interface CreateCourseEntityPayload extends CreateTrainingEntityPayload {
    active: boolean;
    openEnrollment: boolean;
}

export type CourseEntityCommandMetadata = EntityCommandMetaData<CourseEntity>;

export interface CourseEntity extends TrainingEntityPayload {
    active: boolean;
    openEnrollment: boolean;
    orderedModuleIds: string[];
    modules: ModuleEntity[];
    fieldDeltas: CourseEntityDeltas;
}

export interface CourseEntityDeltas extends TrainingEntityDiffDelta {
    active?: boolean;
    openEnrollment?: boolean;
    orderedModuleIds?: DeltaArrDiff;
}

export interface ViewCourseData {
    id: string,
    title: string,
    version: string,
    active: boolean,
    description: string,
    timeEstimate: string,
    createdBy: string,
}

export interface ViewCourseQuillData extends ViewCourseData {
    lastModifiedAt: Moment;
    modules: ViewModuleTransferData[];
    content: ContentSegment[];
}

/**
 * The transfer shape of a course view where properties that refer to quill data instead of have a string of
 * the corresponding ids and timestamps are in string form.
 */
export interface ViewCourseTransferData extends ViewCourseData {
    lastModifiedAt: string;
    modules: ViewModuleTransferData[],
    orderedContentIds: string[],
    orderedQuestionIds: string[],
    orderedContentQuestionIds: string[]
}

export interface UserEnrolledCourseData extends ViewCourseQuillData {
    username: string
    userId: string
    //todo maybe user description?
    //todo module and section progress
}

export interface CourseDescription {
    id: string;
    title: string;
    timeEstimate: string;
}

export interface AdminCourseDescription extends CourseDescription {
    // lastActive?: Moment; todo set up user course progress tracking functionality
}

export interface EnrolledCourseDescription extends CourseDescription {
}

