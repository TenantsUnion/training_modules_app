import * as _ from 'underscore';
import {Moment} from "moment";
import {ViewModuleData, ViewModuleQuillData, ViewModuleTransferData} from './modules';
import {ContentSegment} from './segment';
import {
    CreateTrainingEntityCommand, CreateTrainingEntityPayload, SaveTrainingEntityCommand, SaveTrainingEntityPayload,
    TrainingEntityDiffDelta,
    TrainingEntity, ViewTrainingEntityTransferData, ViewTrainingEntity, ViewTrainingEntityQuillData
} from './training_entity';
import {EntityCommandMetaData} from './entity';
import {DeltaArrOp} from './delta/diff_key_array';
import {diffPropsDeltaObj, TRAINING_ENTITY_BASIC_PROPS} from './delta/diff_delta';
import {QuestionTransferData} from '@shared/questions';

export type CourseEntityType = 'CourseEntity';
export type CreateCourseEntityCommand = CreateTrainingEntityCommand<CourseEntityType, CreateCourseEntityPayload>;
export type SaveCourseEntityCommand = SaveTrainingEntityCommand<CourseEntityType, CourseEntityDeltas>;

export interface CreateCourseEntityPayload extends CreateTrainingEntityPayload {
    active: boolean;
    openEnrollment: boolean;
}

export type SaveCourseEntityPayload = SaveTrainingEntityPayload<CourseEntityDiffDelta>;
export type CourseEntityCommandMetadata = EntityCommandMetaData<CourseEntityType>;

export interface CourseEntity extends TrainingEntity {
    active: boolean;
    openEnrollment: boolean;
    orderedModuleIds: string[];
}

export interface CourseEntityDeltas extends TrainingEntityDiffDelta {
    active?: boolean;
    openEnrollment?: boolean;
    orderedModuleIds?: DeltaArrOp[];
}

export interface ViewCourseData<T extends ViewModuleData<ViewTrainingEntity>> extends ViewTrainingEntity {
    openEnrollment: boolean,
    orderedModuleIds: string[],
    modules: T[]
}

export interface ViewCourseQuillData extends ViewCourseData<ViewModuleQuillData>, ViewTrainingEntityQuillData {}

/**
 * The transfer shape of a course view where properties that refer to quill data have a string of
 * the corresponding ids and timestamps are in string form.
 */
export interface ViewCourseTransferData extends ViewCourseData<ViewModuleTransferData>, ViewTrainingEntityTransferData {}

export interface UserEnrolledCourseData extends ViewCourseQuillData {
    //todo maybe user description?
    //todo module and section progress
} export interface CourseDescription {
    id: string;
    slug?: string;
    title: string;
    description: string;
    timeEstimate?: number;
}

export interface AdminCourseDescription extends CourseDescription {
    // lastActive?: Moment; todo set up user course progress tracking functionality
}

export interface EnrolledCourseDescription extends CourseDescription {
}

export interface CreateCourseResponse extends ViewCourseTransferData {}

export interface CourseEntityDiffDelta extends TrainingEntityDiffDelta {
    active?: boolean;
    openEnrollment?: boolean;
    modules?: DeltaArrOp[];
}

export interface SaveCourseResponse {
    course: ViewCourseTransferData;
}

export const diffBasicPropsCourseProps = (before: ViewCourseQuillData, after: ViewCourseQuillData): CourseEntityDiffDelta => {
    return <CourseEntityDiffDelta> diffPropsDeltaObj(_.extend(['active', 'openEnrollment'], TRAINING_ENTITY_BASIC_PROPS), before, after);
};

/**
 * Map of the placeholder ids to their database sequence id correspondents when a course is created.
 *
 */
export interface CreateCourseIdMap {
    courseId: string,
    [p: string]: string
}
