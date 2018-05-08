import {
    CreateCourseEntityCommand, CreateCourseEntityPayload,
    SaveCourseEntityPayload, SaveCourseResponse, ViewCourseStructure
} from '@shared/courses';
import {getCorrelationId} from '@shared/correlation_id_generator';
import {RootGetters, TypedAction, TypedActionContext,} from 'src/store/store_types';
import {COURSES_LISTING_ACTIONS, COURSES_LISTING_MUTATIONS} from '@webapp/user/store/courses_listing_store';
import {TRAINING_MUTATIONS} from "src/training/training_store";
import {CommandType} from "@shared/entity";
import {coursesService} from "@course/courses_service";
import {COURSE_MUTATIONS} from "@course/course_store";
import {CreateModuleEntityPayload, SaveModuleEntityPayload} from "@shared/modules";
import {moduleHttpService} from "@module/modules_requests";
import {CreateSectionEntityPayload, SaveSectionEntityPayload} from "@shared/sections";
import {sectionHttpService} from "@section/sections_requests";
import {EDIT_TRAINING_MUTATIONS, EditTrainingState} from '@training/edit_training_store/edit_training_state_store';
import {SaveTrainingResponse, TrainingType} from '@shared/training';

export type EditTrainingAction<P, V> = TypedAction<EditTrainingState, P, V>;
export type EditTrainingActions = {[index in EDIT_TRAINING_ACTIONS]} & {
    /**
     * returns the id of the created course
     */
    CREATE_COURSE: EditTrainingAction<CreateCourseEntityPayload, string>,
    /**
     * returns the id of the created module
     */
    CREATE_MODULE: EditTrainingAction<CreateModuleEntityPayload, string>,
    /**
     * returns the id of the created section
     */
    CREATE_SECTION: EditTrainingAction<CreateSectionEntityPayload, string>,

    EDIT_BASIC_FIELD: EditTrainingAction<{ fieldName: string, val: any }, void>;
    SAVE_EDITS: EditTrainingAction<void, void>
}

/**
 * Const for using course mutation type values
 */
export enum EDIT_TRAINING_ACTIONS {
    CREATE_COURSE = 'CREATE_COURSE',
    CREATE_MODULE = 'CREATE_MODULE',
    CREATE_SECTION = 'CREATE_SECTION',

    EDIT_BASIC_FIELD = 'EDIT_BASIC_FIELD',
    SAVE_EDITS = 'SAVE_EDITS'
}

/**
 * Course store actions
 */
export const editTrainingActions: EditTrainingActions = {
    /**
     * @returns {Promise<string>} the created course id
     */
    async CREATE_COURSE({commit, dispatch, rootState, state}, coursePayload: CreateCourseEntityPayload): Promise<string> {
        try {
            let createCourseCommand: CreateCourseEntityCommand = {
                metadata: {
                    userId: rootState.user.userId,
                    id: 'NEW',
                    version: 0,
                    type: CommandType.course,
                    timestamp: new Date().toUTCString(),
                    correlationId: getCorrelationId(rootState.user.userId),
                },
                payload: coursePayload
            };
            commit(EDIT_TRAINING_MUTATIONS.SET_CREATING_COURSE, true);
            let {courseTraining, courseStructure, adminCourseDescriptions} = await coursesService.createCourse(createCourseCommand);
            commit(EDIT_TRAINING_MUTATIONS.SET_CREATING_COURSE, false);

            commit(COURSES_LISTING_MUTATIONS.SET_ADMIN_COURSE_DESCRIPTIONS, adminCourseDescriptions);
            commit(TRAINING_MUTATIONS.SET_TRAINING, courseTraining);
            commit(COURSE_MUTATIONS.SET_COURSE, courseStructure);
            return courseTraining.id;
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    CREATE_MODULE: async ({commit, getters}, createModulePayload: CreateModuleEntityPayload) => {
        commit(EDIT_TRAINING_MUTATIONS.SET_CREATING_MODULE, true);
        let {courseStructure, moduleId, module} = await moduleHttpService.createModule(createModulePayload);
        commit(EDIT_TRAINING_MUTATIONS.SET_CREATING_MODULE, false);

        commit(TRAINING_MUTATIONS.SET_TRAINING, module);
        commit(COURSE_MUTATIONS.SET_COURSE, courseStructure);
        return moduleId;
    },
    CREATE_SECTION: async ({dispatch, commit, getters, rootState}, createSectionData: CreateSectionEntityPayload) => {
        commit(EDIT_TRAINING_MUTATIONS.SET_CREATING_SECTION, true);
        let {sectionId, courseStructure, section} = await sectionHttpService.createSection(createSectionData);
        commit(EDIT_TRAINING_MUTATIONS.SET_CREATING_SECTION, false);
        commit(COURSE_MUTATIONS.SET_COURSE, courseStructure);
        commit(TRAINING_MUTATIONS.SET_TRAINING, section);
        return sectionId;
    },
    EDIT_BASIC_FIELD({rootGetters, commit}, {fieldName, val}) {
        let storedVal = (<RootGetters> rootGetters).currentTraining[fieldName];
        if (storedVal !== val) {
            // set edit training value only if edit is different
            commit(EDIT_TRAINING_MUTATIONS.BASIC_EDIT, {prop: fieldName, val});
        } else {
            // delete edit field since val has been changed back or reset
            commit(EDIT_TRAINING_MUTATIONS.CLEAR_BASIC_EDIT, fieldName);
        }
    },
    async SAVE_EDITS({
                         dispatch, commit,
                         rootGetters: {hasEdits, currentTrainingType},
                         state: {unsavedEdits},
                         rootState: {
                             training: {currentTrainingId},
                             course: {currentCourseId, currentModuleId, currentSectionId}
                         }
                     }: TypedActionContext<EditTrainingState>) {
        if (!hasEdits) {
            return; // no changes to save
        }

        let payload = (() => {
                switch (currentTrainingType) {
                    case TrainingType.COURSE:
                        return {id: currentTrainingId, changes: unsavedEdits} as SaveCourseEntityPayload;
                    case TrainingType.MODULE:
                        return {
                            id: currentTrainingId, courseId: currentCourseId, changes: unsavedEdits
                        } as SaveModuleEntityPayload;
                    case TrainingType.SECTION:
                        return {
                            id: currentTrainingId, changes: unsavedEdits
                        } as SaveSectionEntityPayload;
                    default:
                        throw new Error(`Not a supported training type to save: ${currentTrainingType}`);
                }
            }
        )();

        commit(EDIT_TRAINING_MUTATIONS.ADD_SAVING, currentTrainingId);
        let {training, courseStructure}: SaveTrainingResponse = await savePayload(payload, currentTrainingType);
        commit(EDIT_TRAINING_MUTATIONS.REMOVE_SAVING, currentTrainingId);
        commit(TRAINING_MUTATIONS.SET_TRAINING, training);
        commit(COURSE_MUTATIONS.SET_COURSE, courseStructure);

        // todo better way to handle refreshing a user's course titles, but only when a course name changes
        if (unsavedEdits.title && currentTrainingType === TrainingType.COURSE) {
            // title change means slug changed -- reload admin courses to recalculate slug
            commit(COURSES_LISTING_MUTATIONS.SET_COURSES_LISTINGS_LOADED, false);
            await dispatch(COURSES_LISTING_ACTIONS.LOAD_COURSE_LISTINGS);
        }
    }
};

type SavePayloadType = SaveCourseEntityPayload | SaveModuleEntityPayload | SaveSectionEntityPayload;
const savePayload = async (payload: SavePayloadType, type: TrainingType): Promise<SaveTrainingResponse> => {
    switch (type) {
        case TrainingType.COURSE:
            return coursesService.saveCourse(payload);
        case TrainingType.MODULE:
            return await moduleHttpService.saveModule(payload as SaveModuleEntityPayload);
        case TrainingType.SECTION:
            return await coursesService.saveSection(payload as SaveSectionEntityPayload);
        default:
            throw new Error(`Not a supported training type to save: ${type}`);
    }
};
