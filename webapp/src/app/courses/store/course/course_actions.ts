import {CourseState} from './course_state';
import {COURSE_MUTATIONS} from './course_mutations';
import {
    AdminCourseDescription, CourseEntity, CreateCourseEntityCommand, CreateCourseEntityPayload,
    SaveCourseEntityPayload, SaveCourseResponse, ViewCourseQuillData
} from 'courses';
import {getCorrelationId} from '../../../../../../shared/correlation_id_generator';
import {coursesService} from '../../courses_service';
import {subscribeCourse} from '../../subscribe_course';
import {RootGetters, TypedAction, TypedActionTree} from '../../../state_store';
import {Constant} from '../../../../../../shared/typings/util_typings';
import {USER_COURSES_LISTING_ACTIONS, USER_COURSES_LISTING_MUTATIONS} from '../courses_listing/courses_listing_store';
import {transformTransferViewService} from '../../../global/quill/transform_transfer_view_service';

export interface CourseActions {
    CREATE_COURSE: CourseAction<CreateCourseEntityPayload>,
    SET_CURRENT_COURSE: CourseAction<{ id: string, isAdmin: boolean }>;
    SET_CURRENT_COURSE_FROM_SLUG: CourseAction<{ slug: string, isAdmin: boolean }>;
    SAVE_COURSE: CourseAction<SaveCourseEntityPayload>;
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
};
/**
 * Course store actions
 */
export const courseActions: TypedActionTree<CourseActions, CourseAction<any>> = {
    async CREATE_COURSE({commit, dispatch, rootState, state}, course: CreateCourseEntityPayload) {
        let CREATE_ID = 'CREATING';
        try {
            let createCourseCommand: CreateCourseEntityCommand = {
                metadata: {
                    userId: rootState.user.userId,
                    id: 'NEW',
                    version: '0',
                    type: 'CourseEntity',
                    timestamp: new Date().toUTCString(),
                    correlationId: getCorrelationId(rootState.user.userId),
                },
                payload: course
            };
            commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id: CREATE_ID, requesting: true});
            let courseEntity: ViewCourseQuillData = await coursesService.createCourse(createCourseCommand);
            let updateAdminDescriptions: AdminCourseDescription[] = [courseEntity, ...rootState.userCourses.adminCourseDescriptions];
            commit(USER_COURSES_LISTING_MUTATIONS.SET_ADMIN_COURSE_DESCRIPTIONS, updateAdminDescriptions);
            commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id: CREATE_ID, requesting: false});
            commit(COURSE_MUTATIONS.SET_COURSE_ENTITY, courseEntity);
            await dispatch(COURSE_ACTIONS.SET_CURRENT_COURSE, {id: courseEntity.id, isAdmin: true});
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    async SET_CURRENT_COURSE({state, rootGetters, commit}, {id, isAdmin}): Promise<any> {
        try {
            if (id === state.currentCourseId && isAdmin === state.isAdmin) {
                // current state matches, no changes
                return;
            }

            commit(COURSE_MUTATIONS.SET_CURRENT_COURSE, {id});
            if (isAdmin) {
                commit(COURSE_MUTATIONS.SET_COURSE_ADMIN, isAdmin);
            }
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
    async SET_CURRENT_COURSE_FROM_SLUG({getters, dispatch}, {slug, isAdmin}) {
        await dispatch(USER_COURSES_LISTING_ACTIONS.LOAD_USER_ADMIN_COURSES);
        let id = (<RootGetters> getters).getCourseIdFromSlug(slug);
        await dispatch(COURSE_ACTIONS.SET_CURRENT_COURSE, {id, isAdmin});
    },
    async SAVE_COURSE({commit, dispatch}, saveCourseEntityPayload: SaveCourseEntityPayload) {
        commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id: saveCourseEntityPayload.id, requesting: true});
        try {
            let response: SaveCourseResponse = await coursesService.saveCourse(saveCourseEntityPayload);
            let course = await transformTransferViewService.populateTrainingEntityQuillData(response.course);
            commit(COURSE_MUTATIONS.SET_COURSE_ENTITY, course);
            if (saveCourseEntityPayload.changes.title) {
                // title change means slug changed -- reload admin courses to recalculate slug
                commit(USER_COURSES_LISTING_MUTATIONS.SET_USER_COURSES_LISTINGS_LOADED, false);
                await dispatch(USER_COURSES_LISTING_ACTIONS.LOAD_USER_ADMIN_COURSES);
            }
        } finally {
            commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id: saveCourseEntityPayload.id, requesting: false});
        }
    }
};
