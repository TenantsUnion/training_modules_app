import {transformTransferViewService} from '../../../global/quill/transform_transfer_view_service';
import {ActionContext, ActionTree} from 'vuex';
import {CourseState} from './course_state';
import {ActionType, CommitType} from 'store';
import {COURSE_MUTATIONS, CourseMutationTree} from './course_mutations';
import {CourseEntity, CreateCourseEntityCommand, CreateCourseEntityPayload} from 'courses';
import {userQueryService} from '../../../account/user_query_service';
import {getCorrelationId} from '../../../../../../shared/correlation_id_generator';
import {COURSES_ROUTE_NAMES} from '../../courses_routes';
import {coursesService} from '../../courses_service';
import {appRouter} from '../../../router';
import {subscribeCourse} from '../../subscribe_course';

export interface COURSE_ACTIONS {
    CREATE_COURSE: CreateCourseAction,
    SET_CURRENT_COURSE: SetCurrentCourseAction;
    SET_COURSE_ENTITY: SetCourseEntityAction,
    LOAD_CURRENT_COURSE: CourseAction<string>

    [index: string]: CourseAction<any>;
}

export type CourseAction<P> = ActionType<CourseState, any, P>;

export type CreateCourseAction = CourseAction<CreateCourseEntityPayload>;
export type PopulateCourseQuillDataAction = CourseAction<CourseEntity>;
export type SetCurrentCourseAction = CourseAction<CourseEntity>;
export type SetCourseEntityAction = CourseAction<CourseEntity>;

export type CourseActionTree = ActionTree<CourseState, any> & { [index in keyof COURSE_ACTIONS]: CourseAction<any> }
export type CourseActionContext =
    ActionContext<CourseState, any>
    & { commit: CommitType<keyof COURSE_MUTATIONS, CourseMutationTree> };

/**
 * Const for using course mutation type values
 */
export const COURSE_ACTIONS: {[index in keyof COURSE_ACTIONS]: keyof COURSE_ACTIONS} = {
    CREATE_COURSE: 'CREATE_COURSE',
    SET_CURRENT_COURSE: 'SET_CURRENT_COURSE',
    SET_COURSE_ENTITY: 'SET_COURSE_ENTITY',
    LOAD_CURRENT_COURSE: 'LOAD_CURRENT_COURSE'
};
/**
 * Course store actions
 */
export const courseActions: CourseActionTree = {
    CREATE_COURSE: async (context: CourseActionContext, course: CreateCourseEntityPayload) => {
        let CREATE_ID = 'CREATING';
        try {
            let createCourseCommand: CreateCourseEntityCommand = {
                metadata: {
                    userId: userQueryService.getUserId(),
                    id: 'NEW',
                    version: '0',
                    type: 'CourseEntity',
                    timestamp: new Date().toUTCString(),
                    correlationId: getCorrelationId(userQueryService.getUserId()),
                },
                payload: course
            };
            let pendingCourseId = coursesService.createCourse(createCourseCommand);
            context.commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id: CREATE_ID, stage: 'WAITING'});
            let courseId = await pendingCourseId;
            context.commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id: CREATE_ID, stage: 'SUCCESS'});
            await context.dispatch(COURSE_ACTIONS.SET_CURRENT_COURSE, {id: courseId, isAdmin: true});

            appRouter.push({
                name: COURSES_ROUTE_NAMES.adminCourseDetails,
                params: {
                    courseTitle: course.title// todo calculate slug
                }
            });
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    SET_CURRENT_COURSE: async (context: CourseActionContext, {id, isAdmin}: { id: string, isAdmin: boolean }): Promise<void> => {
        if (isAdmin === context.state.isAdmin && id === context.state.currentCourseId) {
            // current state matches, no changes
            return;
        }
        let courseRouteName = isAdmin ? COURSES_ROUTE_NAMES.adminCourseDetails
            : COURSES_ROUTE_NAMES.enrolledCourseDetails;

        let loadingCourse = context.state.courses[id] ? context.state.courses[id]
            : await coursesService.loadAdminCourse(id);

        let course = await transformTransferViewService.populateTrainingEntityQuillData(loadingCourse);
        subscribeCourse(id);

        context.commit(COURSE_MUTATIONS.SET_CURRENT_COURSE, {course, id, isAdmin});
        appRouter.push({
            name: courseRouteName,
            params: {
                courseTitle: course.title
            }
        });
    },
    LOAD_CURRENT_COURSE: async (context: CourseActionContext, courseId: string) => {
        let course = context.state.courses[courseId] ? context.state.courses[courseId]
            : await coursesService.loadAdminCourse(courseId);

        await transformTransferViewService.populateTrainingEntityQuillData(course);
        context.commit(COURSE_MUTATIONS.SET_COURSE_ENTITY)


    },
    SET_COURSE_ENTITY: async (context: CourseActionContext, payload: CourseEntity) => {
        let course = await transformTransferViewService.populateTrainingEntityQuillData(payload);
        context.commit(COURSE_MUTATIONS.SET_COURSE_ENTITY, course);
    }
}
