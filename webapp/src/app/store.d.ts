import {Action, ActionContext, ActionTree, GetterTree, Module, MutationTree} from "vuex";
import {UserState} from "@user/store/user_store";
import {CourseGetters, CourseState} from "@course/store/course_state";
import {ModuleGetters, ModuleState} from "@module/store/module_state";
import {SectionGetters, SectionState} from "@section/store/section_state";
import {CoursesListingGetters, CoursesListingState} from "@user/store/courses_listing_store";
import {UserProgressGetters, UserProgressState} from "@user_progress/user_progress_store";
import {AvailableCoursesGetters, AvailableCoursesState} from "@webapp_root/available_courses/available_courses_store";
import {StatusMessagesState} from "@global/status_messages/status_messages_store";


/**
 * Type for vuex action that generically types the payload (default definition has payload typed to 'any')
 * Stronger typing than vuex ActionTree that only enforces string keys and Action properties.
 * This goes one step further by being able to enforce an interface I with each property an action with a typed payload
 */
type TypedAction<S, P, V> = (context: ActionContext<S, RootState>, payload: P) => (Promise<V> | V) | Action<S, RootState>;

type VuexModule<S, A extends ActionTree<S, RootState>, G extends GetterTree<S, RootState>, M extends MutationTree<S>> =
    {
        actions?: A, getters?: G, mutations?: M
    }
    & Module<S, RootState>;

interface VuexModuleConfig<S, G extends GetterTree<S, RootState>,
    A extends ActionTree<S, RootState>, M extends MutationTree<S>> {
    initState (): S;

    module (): VuexModule<S, A, G, M>;
}

interface RootState {
    user: UserState,
    course: CourseState
    module: ModuleState,
    section: SectionState,
    userCourses: CoursesListingState,
    userProgress: UserProgressState,
    availableCourses: AvailableCoursesState
    statusMessages: StatusMessagesState
}

type RootGetters = CourseGetters & CoursesListingGetters & ModuleGetters
    & SectionGetters & AvailableCoursesGetters & UserProgressGetters;

// getters and rootGetters are the same since the modules have the namespace option set to false
type AppGetter<S> = ((state: S, getters: RootGetters, rootState: RootState, rootGetters: RootGetters) => any);
