import {ViewModuleDescription} from './modules';
import {
    CreateTrainingEntityCommand, CreateTrainingEntityPayload, SaveTrainingEntityCommand, SaveTrainingEntityPayload,
    TrainingEntityDiffDelta,
    TrainingEntity, ViewTrainingEntity, ContentQuestionsDelta
} from './training_entity';
import {EntityCommandMetaData} from './entity';
import {DeltaArrOp} from './delta/diff_key_array';
import {diffPropsDeltaObj, TRAINING_ENTITY_BASIC_PROPS} from './delta/diff_delta';

export type CourseEntityType = 'CourseEntity';
export type CreateCourseEntityCommand = CreateTrainingEntityCommand<CourseEntityType, CreateCourseEntityPayload>;
export type SaveCourseEntityCommand = SaveTrainingEntityCommand<CourseEntityType, CourseEntityDeltas>;

export interface CreateCourseEntityPayload extends CreateTrainingEntityPayload {
    openEnrollment: boolean;
}

export type SaveCourseEntityPayload = SaveTrainingEntityPayload<CourseEntityDiffDelta>;
export type CourseEntityCommandMetadata = EntityCommandMetaData<CourseEntityType>;

export interface CourseEntity extends TrainingEntity {
    openEnrollment: boolean;
    orderedModuleIds: string[];
}

export interface CourseEntityDeltas extends TrainingEntityDiffDelta {
    openEnrollment?: boolean;
    orderedModuleIds?: DeltaArrOp<string>[];
}

export interface ViewCourseData extends ViewTrainingEntity {
    openEnrollment: boolean,
    modules: ViewModuleDescription[]
}

export interface ViewCourseDelta extends TrainingEntityDiffDelta {
    openEnrollment?: boolean,
    // replace, move and update module descriptions
    modules?: DeltaArrOp<ViewModuleDescription>[]
}

export interface UserEnrolledCourseData extends ViewCourseData {
    //todo maybe user description?
    //todo module and section progress
}

export interface CourseDescription {
    id: string;
    slug?: string;
    title: string;
    description: string;
    timeEstimate?: number;
    admins?: string[]
}

export interface AdminCourseDescription extends CourseDescription {
    // lastActive?: Moment; todo set up user course progress tracking functionality
}

export interface EnrolledCourseDescription extends CourseDescription {
}

export interface CreateCourseResponse extends ViewCourseData {
}

export interface CourseEntityDiffDelta extends TrainingEntityDiffDelta {
    openEnrollment?: boolean;
    modules?: DeltaArrOp<string>[];
}

export interface SaveCourseResponse {
    course: ViewCourseData;
}

export const diffBasicPropsCourseProps = (before: ViewCourseData, after: ViewCourseData): CourseEntityDiffDelta => {
    return <CourseEntityDiffDelta> diffPropsDeltaObj(['openEnrollment', 'answerImmediately',
        ...TRAINING_ENTITY_BASIC_PROPS], before, after);
};

/**
 * Map of the placeholder ids to their database sequence id correspondents when a course is created.
 *
 */
export interface CreateCourseIdMap {
    courseId: string,

    [p: string]: string
}
