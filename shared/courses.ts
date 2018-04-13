import {ViewModuleDescription} from './modules';
import {
    CreateTrainingEntityCommand, CreateTrainingEntityPayload, SaveTrainingEntityCommand, SaveTrainingEntityPayload,
    TrainingEntityDiffDelta, TrainingEntity, TrainingView, TrainingDescriptionView
} from './training';
import {DeltaArrOp} from './delta/diff_key_array';
import {diffPropsDeltaObj, TRAINING_ENTITY_BASIC_PROPS} from './delta/diff_delta';
import {CommandType} from "@shared/entity";

export type CreateCourseEntityCommand = CreateTrainingEntityCommand<CommandType.course, CreateCourseEntityPayload>;
export type SaveCourseEntityCommand = SaveTrainingEntityCommand<CommandType.course, CourseEntityDeltas>;

export interface CreateCourseEntityPayload extends CreateTrainingEntityPayload {
    openEnrollment: boolean;
    userId: string;
}

export type SaveCourseEntityPayload = SaveTrainingEntityPayload<CourseEntityDiffDelta>;

export interface CourseEntity extends TrainingEntity {
    openEnrollment: boolean;
    orderedModuleIds: string[];
}

export interface CourseEntityDeltas extends TrainingEntityDiffDelta {
    openEnrollment?: boolean;
    orderedModuleIds?: DeltaArrOp<string>[];
}

export interface ViewCourseStructure extends TrainingDescriptionView {
    modules: ViewModuleDescription[]
}

export interface ViewCourseData extends TrainingView {
    openEnrollment?: boolean,
    modules: ViewModuleDescription[]
}

export interface CourseDescription {
    id: string;
    slug?: string;
    title: string;
    description?: string;
    timeEstimate?: number;
    admins?: string[];
    lastModifiedAt?: string;
    createdAt?: string;
}

export interface CoursesListingView {
    userId: string;
    enrolled: CourseDescription[],
    admin: CourseDescription[]
}

export interface CreateCourseResponse {
    courseTraining: ViewCourseData,
    courseStructure: ViewCourseStructure,
    adminCourseDescriptions: CourseDescription[]
}

export interface CourseEntityDiffDelta extends TrainingEntityDiffDelta {
    openEnrollment?: boolean;
    modules?: DeltaArrOp<string>[];
}

export interface SaveCourseResponse {
    courseTraining: ViewCourseData;
    courseStructure: ViewCourseStructure;
}

export const diffBasicPropsCourseProps = (before: ViewCourseData, after: ViewCourseData): CourseEntityDiffDelta => {
    return <CourseEntityDiffDelta> diffPropsDeltaObj(['openEnrollment', 'submitIndividually',
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
