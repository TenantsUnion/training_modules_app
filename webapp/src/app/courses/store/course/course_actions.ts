import {Action, ActionContext, ActionTree} from 'vuex';
import {CourseState} from './course_state';
import {COURSE_MUTATIONS} from './course_mutations';
import {CourseEntity, CreateCourseEntityCommand, CreateCourseEntityPayload} from 'courses';
import {getCorrelationId} from '../../../../../../shared/correlation_id_generator';
import {coursesService} from '../../courses_service';
import {subscribeCourse} from '../../subscribe_course';
import {AppGetters, RootState} from '../../../state_store';
import {Constant} from '../../../../../../shared/typings/util_typings';

export interface CourseActions {
    CREATE_COURSE: CourseAction<CreateCourseEntityPayload>,
    SET_CURRENT_COURSE: CourseAction<{id: string, isAdmin: boolean}>;
    SET_CURRENT_COURSE_FROM_SLUG: CourseAction<{slug: string, isAdmin: boolean}>;
}

export type CourseAction<P> =
    (context: ActionContext<CourseState, RootState>, payload: P) => Promise<any> | Action<CourseState, RootState>;

/**
 * Const for using course mutation type values
 */
export const COURSE_ACTIONS: Constant<CourseActions>= {
    CREATE_COURSE: 'CREATE_COURSE',
    SET_CURRENT_COURSE: 'SET_CURRENT_COURSE',
    SET_CURRENT_COURSE_FROM_SLUG: 'SET_CURRENT_COURSE_FROM_SLUG'
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
            commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id: CREATE_ID, requesting: true});
            let {id, slug} = await courseInfo;
            commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id: CREATE_ID, stage: 'SUCCESS'});
            await dispatch(COURSE_ACTIONS.SET_CURRENT_COURSE, {id, slug, isAdmin: true});
            return 'hi';
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
            if(isAdmin) {
                commit(COURSE_MUTATIONS.SET_COURSE_ADMIN, isAdmin);
            }
            if(!rootGetters.currentCourseLoaded){
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
        let id = (<AppGetters> getters).getCourseIdFromSlug(slug);
        dispatch(COURSE_ACTIONS.SET_CURRENT_COURSE, {id, isAdmin});
    }

};
