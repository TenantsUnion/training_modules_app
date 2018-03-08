import {CourseState} from './course_state';
import {COURSE_MUTATIONS, CourseMode} from './course_mutations';
import {
    AdminCourseDescription, CourseEntity, CreateCourseEntityCommand, CreateCourseEntityPayload,
    SaveCourseEntityPayload, SaveCourseResponse, ViewCourseData
} from '@shared/courses';
import {getCorrelationId} from '@shared/correlation_id_generator';
import {coursesService} from '../courses_service';
import {RootGetters, RootState, TypedAction} from '@webapp_root/store';
import {Constant} from '@shared/typings/util_typings';
import {COURSES_LISTING_ACTIONS, COURSES_LISTING_MUTATIONS} from '@user/store/courses_listing_store';
import {ActionTree} from "vuex";

export type CourseAction<P, V> = TypedAction<CourseState, P, V>;
export interface CourseActions extends ActionTree<CourseState, RootState> {
    CREATE_COURSE: CourseAction<CreateCourseEntityPayload, string>,
    SET_CURRENT_COURSE: CourseAction<string, void>;
    SET_CURRENT_COURSE_FROM_SLUG: CourseAction<string, void>;
    SAVE_COURSE: CourseAction<SaveCourseEntityPayload, void>;
}

/**
 * Const for using course mutation type values
 */
export const COURSE_ACTIONS: Constant<CourseActions> = {
    CREATE_COURSE: 'CREATE_COURSE',
    SET_CURRENT_COURSE: 'SET_CURRENT_COURSE',
    SET_CURRENT_COURSE_FROM_SLUG: 'SET_CURRENT_COURSE_FROM_SLUG',
    SAVE_COURSE: 'SAVE_COURSE',
};
/**
 * Course store actions
 */
export const courseActions: CourseActions = {
    /**
     * @returns {Promise<string>} the created course id
     */
    async CREATE_COURSE ({commit, dispatch, rootState, state}, course: CreateCourseEntityPayload): Promise<string> {
        let CREATE_ID = 'CREATING';
        try {
            let createCourseCommand: CreateCourseEntityCommand = {
                metadata: {
                    userId: rootState.user.userId,
                    id: 'NEW',
                    version: 0,
                    type: 'CourseEntity',
                    timestamp: new Date().toUTCString(),
                    correlationId: getCorrelationId(rootState.user.userId),
                },
                payload: course
            };
            commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id: CREATE_ID, requesting: true});
            let courseEntity: ViewCourseData = await coursesService.createCourse(createCourseCommand);
            let updateAdminDescriptions: AdminCourseDescription[] = [courseEntity, ...rootState.coursesListing.adminCourseDescriptions];
            commit(COURSES_LISTING_MUTATIONS.SET_ADMIN_COURSE_DESCRIPTIONS, updateAdminDescriptions);
            commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id: CREATE_ID, requesting: false});
            commit(COURSE_MUTATIONS.SET_COURSE_ENTITY, courseEntity);
            return courseEntity.id;
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    async SET_CURRENT_COURSE ({state, rootGetters, commit, dispatch}, id): Promise<void> {
        try {
            if (id === state.currentCourseId) {
                return; // current state matches, no changes
            }

            commit(COURSE_MUTATIONS.SET_CURRENT_COURSE, id);
            if (!rootGetters.currentCourseTrainingLoaded) {
                commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id, requesting: true});
                let course = await coursesService.loadAdminCourse(id);
                commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id, requesting: false});
                commit(COURSE_MUTATIONS.SET_COURSE_ENTITY, course);
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    async SET_CURRENT_COURSE_FROM_SLUG ({getters, dispatch, rootState}, slug) {
        await dispatch(COURSES_LISTING_ACTIONS.LOAD_COURSE_LISTINGS);
        let mode = (<RootGetters> getters).getCourseModeFromSlug(slug);
        let id = mode === CourseMode.PREVIEW ? (<RootGetters> getters).getAvailableCourseIdFromSlug(slug) :
            (<RootGetters> getters).getCourseIdFromSlug(slug);
        await dispatch(COURSE_ACTIONS.SET_CURRENT_COURSE, id);
    },
    async SAVE_COURSE ({commit, dispatch}, saveCourseEntityPayload: SaveCourseEntityPayload) {
        commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id: saveCourseEntityPayload.id, requesting: true});
        try {
            let response: SaveCourseResponse = await coursesService.saveCourse(saveCourseEntityPayload);
            commit(COURSE_MUTATIONS.SET_COURSE_ENTITY, response.course);
            if (saveCourseEntityPayload.changes.title) {
                // title change means slug changed -- reload admin courses to recalculate slug
                commit(COURSES_LISTING_MUTATIONS.SET_COURSES_LISTINGS_LOADED, false);
                await dispatch(COURSES_LISTING_ACTIONS.LOAD_COURSE_LISTINGS);
            }
        } finally {
            commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id: saveCourseEntityPayload.id, requesting: false});
        }
    }
};
