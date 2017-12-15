import {transformTransferViewService} from '../../../global/quill/transform_transfer_view_service';
import {Action, ActionContext, ActionTree} from 'vuex';
import {CourseState} from './course_state';
import {COURSE_MUTATIONS} from './course_mutations';
import {CourseEntity, CreateCourseEntityCommand, CreateCourseEntityPayload} from 'courses';
import {userQueryService} from '../../../account/user_query_service';
import {getCorrelationId} from '../../../../../../shared/correlation_id_generator';
import {COURSES_ROUTE_NAMES} from '../../courses_routes';
import {coursesService} from '../../courses_service';
import {appRouter} from '../../../router';
import {subscribeCourse} from '../../subscribe_course';
import {RootState} from '../../../state_store';
import {Constant} from '../../../../../../shared/typings/util_typings';

export interface CourseActions {
    CREATE_COURSE: CourseAction<CreateCourseEntityPayload>,
    SET_CURRENT_COURSE: CourseAction<{id?: string, title?: string, isAdmin: boolean, slug?: string}>;
    [key: string]: Action<CourseState, RootState>;
}

export type CourseAction<P> =
    (context: ActionContext<CourseState, RootState>, payload: P) => Promise<any> | Action<CourseState, RootState>;

/**
 * Const for using course mutation type values
 */
export const COURSE_ACTIONS: Constant<CourseActions>= {
    CREATE_COURSE: 'CREATE_COURSE',
    SET_CURRENT_COURSE: 'SET_CURRENT_COURSE',
};
/**
 * Course store actions
 */
export const courseActions: CourseActions & ActionTree<CourseState, RootState> = {
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
            let courseInfo = coursesService.createCourse(createCourseCommand);
            commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id: CREATE_ID, stage: 'WAITING'});
            let {id, slug} = await courseInfo;
            commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id: CREATE_ID, stage: 'SUCCESS'});
            await dispatch(COURSE_ACTIONS.SET_CURRENT_COURSE, {id, slug, isAdmin: true});
            return 'hi';
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    async SET_CURRENT_COURSE({state, rootState, commit}, {id, slug, isAdmin}): Promise<any> {
        try {
            if (!id && slug) {
                let course = await coursesService.getAdminCourseFromSlug(slug, rootState.user.userId);
                id = course.id;
            }
            let noChange = id === state.currentCourseId && isAdmin === state.isAdmin;
            if (noChange) {
                // current state matches, no changes
                return;
            }
            let courseRouteName = isAdmin ? COURSES_ROUTE_NAMES.adminCourseDetails
                : COURSES_ROUTE_NAMES.enrolledCourseDetails;

            let loadingCourse = state.courses[id] ? state.courses[id]
                : await coursesService.loadAdminCourse(id);

            let course = await transformTransferViewService.populateTrainingEntityQuillData(loadingCourse);
            subscribeCourse(id);

            commit(COURSE_MUTATIONS.SET_CURRENT_COURSE, {course, id, slug, isAdmin});
            appRouter.push({
                name: courseRouteName,
                params: {
                    courseSlug: slug
                }
            });
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
};
