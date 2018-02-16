import {CourseState} from './course_state';
import {COURSE_MUTATIONS, CourseMode} from './course_mutations';
import {
    AdminCourseDescription, CourseEntity, CreateCourseEntityCommand, CreateCourseEntityPayload,
    SaveCourseEntityPayload, SaveCourseResponse, ViewCourseData
} from '../../../../../shared/courses';
import {getCorrelationId} from '../../../../../shared/correlation_id_generator';
import {coursesService} from '../courses_service';
import {subscribeCourse} from '../subscribe_course';
import {RootGetters, TypedAction, TypedActionTree} from '../../state_store';
import {Constant} from '../../../../../shared/typings/util_typings';
import {USER_COURSES_LISTING_ACTIONS, USER_COURSES_LISTING_MUTATIONS} from '../../user/store/courses_listing_store';

export interface CourseActions {
    CREATE_COURSE: CourseAction<CreateCourseEntityPayload>,
    SET_CURRENT_COURSE: CourseAction<{ id: string, mode: CourseMode }>;
    SET_CURRENT_COURSE_FROM_SLUG: CourseAction<string>;
    SAVE_COURSE: CourseAction<SaveCourseEntityPayload>;
    ENROLL_IN_COURSE: CourseAction<string>;
}

export type CourseAction<P> = TypedAction<CourseState, P>;

/**
 * Const for using course mutation type values
 */
export const COURSE_ACTIONS: Constant<CourseActions> = {
    CREATE_COURSE: 'CREATE_COURSE',
    SET_CURRENT_COURSE: 'SET_CURRENT_COURSE',
    SET_CURRENT_COURSE_FROM_SLUG: 'SET_CURRENT_COURSE_FROM_SLUG',
    SAVE_COURSE: 'SAVE_COURSE',
    ENROLL_IN_COURSE: 'ENROLL_IN_COURSE'
};
/**
 * Course store actions
 */
export const courseActions: TypedActionTree<CourseActions, CourseAction<any>> = {
    async CREATE_COURSE ({commit, dispatch, rootState, state}, course: CreateCourseEntityPayload) {
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
            let updateAdminDescriptions: AdminCourseDescription[] = [courseEntity, ...rootState.userCourses.adminCourseDescriptions];
            commit(USER_COURSES_LISTING_MUTATIONS.SET_ADMIN_COURSE_DESCRIPTIONS, updateAdminDescriptions);
            commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id: CREATE_ID, requesting: false});
            commit(COURSE_MUTATIONS.SET_COURSE_ENTITY, courseEntity);
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    async SET_CURRENT_COURSE ({state, rootGetters, commit}, {id, mode}): Promise<void> {
        try {
            if (id === state.currentCourseId && mode === state.mode) {
                // current state matches, no changes
                return;
            }

            commit(COURSE_MUTATIONS.SET_MODE, mode);
            commit(COURSE_MUTATIONS.SET_CURRENT_COURSE, {id});
            if (!rootGetters.currentCourseLoaded) {
                commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id, requesting: true});
                let course = await coursesService.loadAdminCourse(id);
                commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id, requesting: false});
                commit(COURSE_MUTATIONS.SET_COURSE_ENTITY, course);
            }

            subscribeCourse(id);
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    async SET_CURRENT_COURSE_FROM_SLUG ({getters, dispatch, rootState}, slug) {
        await dispatch(USER_COURSES_LISTING_ACTIONS.LOAD_USER_ADMIN_COURSES);
        let mode = (<RootGetters> getters).getUserCourseModeFromSlug(slug);
        let id = mode === CourseMode.PREVIEW ? (<RootGetters> getters).getAvailableCourseIdFromSlug(slug) :
            (<RootGetters> getters).getUserCourseIdFromSlug(slug);
        await dispatch(COURSE_ACTIONS.SET_CURRENT_COURSE, {id, mode});
    },
    async SAVE_COURSE ({commit, dispatch}, saveCourseEntityPayload: SaveCourseEntityPayload) {
        commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id: saveCourseEntityPayload.id, requesting: true});
        try {
            let response: SaveCourseResponse = await coursesService.saveCourse(saveCourseEntityPayload);
            commit(COURSE_MUTATIONS.SET_COURSE_ENTITY, response.course);
            if (saveCourseEntityPayload.changes.title) {
                // title change means slug changed -- reload admin courses to recalculate slug
                commit(USER_COURSES_LISTING_MUTATIONS.SET_USER_COURSES_LISTINGS_LOADED, false);
                await dispatch(USER_COURSES_LISTING_ACTIONS.LOAD_USER_ADMIN_COURSES);
            }
        } finally {
            commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id: saveCourseEntityPayload.id, requesting: false});
        }
    },
    async ENROLL_IN_COURSE ({commit, dispatch, getters}, courseId: string) {
        // todo get current user login id and make async call to http service to make POST for user to enroll in course
    }
};
