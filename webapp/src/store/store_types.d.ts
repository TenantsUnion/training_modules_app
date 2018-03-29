import {
    CourseProgressSummaryAccessors,
    CourseProgressSummaryState
} from "@course/course_enrolled_progress/course_progress_summary/course_progress_summary_store";
import {CourseAccessors, CourseState} from "@course/course_store";
import {StatusMessagesState} from "@global/status_messages/status_messages_store";
import {TrainingAccessors, TrainingState} from "@training/training_store";
import {AvailableCoursesAccessors, AvailableCoursesState} from "@webapp/available_courses/available_courses_store";
import {CoursesListingAccessors, CoursesListingState} from "@webapp/user/store/courses_listing_store";
import {UserState} from "@webapp/user/store/user_store";
import {UserProgressAccessors, UserProgressState} from "@webapp/user_progress/user_progress_store";
import {Action, ActionContext, ActionTree, Getter, GetterTree, Module, MutationTree} from "vuex";


/**
 * Type for vuex action that generically types the payload (default definition has payload typed to 'any')
 * Stronger typing than vuex ActionTree that only enforces string keys and Action properties.
 * This goes one step further by being able to enforce an interface I with each property an action with a typed payload
 */
export type TypedAction<S, P, V> = (context: ActionContext<S, RootState>, payload: P) => (Promise<V> | V) | Action<S, RootState>;

export type VuexModule<S, A extends ActionTree<S, RootState>, G extends GetterTree<S, RootState>, M extends MutationTree<S>> =
    {
        state: S, actions?: A, getters?: G, mutations?: M
    }
    & Module<S, RootState>;

export interface VuexModuleConfig<S, G extends GetterTree<S, RootState>,
    A extends ActionTree<S, RootState>, M extends MutationTree<S>> {
    initState (): S;

    module (): VuexModule<S, A, G, M>;
}

export interface RootState {
    user: UserState,
    course: CourseState
    coursesListing: CoursesListingState,
    userProgress: UserProgressState,
    availableCourses: AvailableCoursesState,
    statusMessages: StatusMessagesState,
    training: TrainingState,
    courseProgressSummary: CourseProgressSummaryState
}

export type RootGetters = CourseAccessors & CoursesListingAccessors
    & AvailableCoursesAccessors & UserProgressAccessors & TrainingAccessors & CourseProgressSummaryAccessors;

// getters and rootGetters are the same since the modules have the namespace option set to false
export type AppGetter<S> = ((state: S, getters: RootGetters, rootState: RootState, rootGetters: RootGetters) => any)
    & Getter<S, RootState>;


