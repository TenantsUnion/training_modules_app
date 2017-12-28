import * as _ from 'underscore';
import {Moment} from "moment";
import {ModuleEntity, ViewModuleTransferData} from 'modules.ts';
import {ContentSegment} from './segment';
import {
    CreateTrainingEntityCommand, CreateTrainingEntityPayload, SaveTrainingEntityCommand, SaveTrainingEntityPayload,
    TrainingEntityDiffDelta,
    TrainingEntityPayload
} from './training_entity';
import {EntityCommandMetaData} from './entity';
import {DeltaArrOps} from './delta/diff_key_array';
import {diffPropsDeltaObj, TRAINING_ENTITY_BASIC_PROPS} from './delta/diff_delta';

export type CourseEntityType = 'CourseEntity';
export type CreateCourseEntityCommand = CreateTrainingEntityCommand<CourseEntityType, CreateCourseEntityPayload>;
export type SaveCourseEntityCommand = SaveTrainingEntityCommand<CourseEntityType, CourseEntityDeltas>;

export interface CreateCourseEntityPayload extends CreateTrainingEntityPayload {
    active: boolean;
    openEnrollment: boolean;
}

export type SaveCourseEntityPayload = SaveTrainingEntityPayload<CourseEntityDiffDelta>;
export type CourseEntityCommandMetadata = EntityCommandMetaData<CourseEntityType>;

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
    orderedModuleIds?: DeltaArrOps;
}

export interface ViewCourseData {
    id: string,
    title: string,
    version: string,
    active: boolean,
    openEnrollment: boolean,
    description: string,
    timeEstimate: string,
    createdBy: string,

    orderedModuleIds: string[],
    orderedContentIds: string[],
    orderedQuestionIds: string[],
    orderedContentQuestionIds: string[]
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
    orderedModuleIds: string[],
    orderedContentIds: string[],
    orderedQuestionIds: string[],
    orderedContentQuestionIds: string[]
}

export interface UserEnrolledCourseData extends ViewCourseQuillData {
    //todo maybe user description?
    //todo module and section progress
} export interface CourseDescription {
    id: string;
    slug?: string;
    title: string;
    description: string;
    timeEstimate?: number | string;
}

export interface AdminCourseDescription extends CourseDescription {
    // lastActive?: Moment; todo set up user course progress tracking functionality
}

export interface EnrolledCourseDescription extends CourseDescription {
}

export interface CreateCourseResponse {
    id: string,
    title: string,
    slug: string
}

export interface CourseEntityDiffDelta extends TrainingEntityDiffDelta {
    active?: boolean;
    openEnrollment?: boolean;
    modules?: DeltaArrOps;
}

export interface SaveCourseResponse {
    course: ViewCourseTransferData;
}

export const diffBasicPropsCourseProps = (before: ViewCourseQuillData, after: ViewCourseQuillData): CourseEntityDiffDelta => {
    return <CourseEntityDiffDelta> diffPropsDeltaObj(_.extend(['active', 'openEnrollment'], TRAINING_ENTITY_BASIC_PROPS), before, after);
};


