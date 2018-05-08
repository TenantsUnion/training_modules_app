import {CourseAccessors, CourseState} from "@course/course_store";
import {StatusMessagesState} from "@global/status_messages/status_messages_store";
import {TrainingAccessors, TrainingState} from "@training/training_store";
import {AvailableCoursesAccessors, AvailableCoursesState} from "@webapp/available_courses/available_courses_store";
import {CoursesListingAccessors, CoursesListingState} from "@webapp/user/store/courses_listing_store";
import {UserState} from "@webapp/user/store/user_store";
import {UserProgressAccessors, UserProgressState} from "@webapp/user_progress/user_progress_store";
import {Action, ActionContext, ActionTree, Getter, GetterTree, Module, MutationTree} from "vuex";
import {
    CourseProgressSummaryAccessors,
    CourseProgressSummaryState
} from '@course/course_enrolled/course_enrolled_summary/course_enrolled_summary_store';
import {
    EditTrainingAccessors,
    EditTrainingGetters,
    EditTrainingState
} from '@training/edit_training_store/edit_training_state_store';


export type TypedActionContext<S> = ActionContext<S, RootState> & {
    rootGetters: RootGetters
}
/**
 * Type for vuex action that generically types the payload (default definition has payload typed to 'any')
 * Stronger typing than vuex ActionTree that only enforces string keys and Action properties.
 * This goes one step further by being able to enforce an interface I with each property an action with a typed payload
 */
export type TypedAction<S, P, V> = (context: TypedActionContext<S>, payload: P) => (Promise<V> | V) | Action<S, RootState>;

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
    editTraining: EditTrainingState,
    courseProgressSummary: CourseProgressSummaryState
}

/**
 * Interfaces of all the getter properties available on the root store from each module. Accessor interfaces are used
 * for defining how to access or read getter field either has a value returned or a function to call to get the value
 *
 * The Getter interfaces for each module are used to defined the function that computes the getter value and is called
 * with arguments of the current state {@see Getter} via the Vuex library.
 *
 * @see AppGetter - stricter typing (possible subset) of the Vuex library compute getter function
 */
export type RootGetters = CourseAccessors & CoursesListingAccessors & EditTrainingAccessors
    & AvailableCoursesAccessors & UserProgressAccessors & TrainingAccessors & CourseProgressSummaryAccessors;

// getters and rootGetters are the same since the modules have the namespace option set to false
export type AppGetter<S> = ((state: S, getters: RootGetters, rootState: RootState, rootGetters: RootGetters) => any)
    & Getter<S, RootState>;


