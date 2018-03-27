import sinon, {SinonSpy, SinonSpyCall} from 'sinon';
import {ActionContext, Commit, Store} from 'vuex';
import {RootState} from "@store/store_types";
import {userStoreConfig} from "@webapp/user/store/user_store";
import {coursesListingStoreConfig} from "@webapp/user/store/courses_listing_store";
import {userProgressStoreConfig} from "@webapp/user_progress/user_progress_store";
import {statusMessageStoreConfig} from "@webapp/global/status_messages/status_messages_store";
import {trainingStoreConfig} from "@webapp/training/training_store";
import {availableCoursesStoreConfig} from "@webapp/available_courses/available_courses_store";
import {courseStoreConfig} from "@webapp/course/course_store";
import {courseProgressSummaryConfig} from "@webapp/course/admin/course_progress_summary/course_progress_summary_store";

/**
 * Represents an {@link ActionContext} whose dispatch and commit properties have been wrapped with {@link SinonSpy}s
 */
export type SpyActionContext<T> = ActionContext<T, RootState> & {
    dispatch: SinonSpy,
    commit: SinonSpy
};


/**
 * Creates spies for the {@link Dispatch} and {@link Commit} of the provided {@link Store} to create an {@link ActionContext}
 * from the {@param rootStore}. The state parameter is used as the local module {@link ActionContext#state}
 *
 * @param {Store<RootState>} rootStore
 * @param {T} state
 * @returns {SpyActionContext<T>}
 */
export const spyActionContext = <T> (rootStore: Store<RootState>, state: T): SpyActionContext<T> => {
    let dispatch = sinon.spy(rootStore, 'dispatch');
    let commit = sinon.spy(rootStore, 'commit');

    return {
        dispatch, commit,
        state: state,
        getters: rootStore.getters,
        rootState: rootStore.state,
        rootGetters: rootStore.getters
    };
};

/**
 * Resets the provided vuex store state to based on the modules of {@link RootState} and the initial state of
 * the corresponding implementation of {@link VuexModuleConfig#initState}
 */
export const resetState = (store: Store<RootState>) => {
    let baseState: RootState = {
        user: userStoreConfig.initState(),
        course: courseStoreConfig.initState(),
        coursesListing: coursesListingStoreConfig.initState(),
        userProgress: userProgressStoreConfig.initState(),
        availableCourses: availableCoursesStoreConfig.initState(),
        statusMessages: statusMessageStoreConfig.initState(),
        training: trainingStoreConfig.initState(),
        courseProgressSummary: courseProgressSummaryConfig.initState()
    };
    store.replaceState(baseState);
};

/**
 * Restores any spies attached to the provided {@link Store} commit and dispatch. Will cause an exception for
 * trying to wrap a spy around a spy with a stack trace of:
 *  "TypeError: Attempted to wrap dispatch which is already wrapped
 *          at checkWrappedMethod..."
 *
 */
export const restoreStoreContext = (rootStore) => {
    rootStore.dispatch.restore && rootStore.dispatch.restore();
    rootStore.commit.restore && rootStore.commit.restore();
};

/**
 * Returns the mutations in the form of {@link MutationCall}s that were committed using the specified context
 * @param {SpyActionContext<any>} context
 * @returns {MutationCall[]}
 */
export const actionContextMutations = (context: SpyActionContext<any>): MutationCall[] => {
    return spyCommitMutations(context.commit);
};

/**
 * Returns the calls made on the spied on vuex {@link Commit} as {@link MutationCall}s. The first parameter of each
 * {@link SinonSpyCall} is the mutation name and if there is only one other mutation parameter that is used for
 * {@link MutationCall#payload} else the remaining args array is used.
 *
 * @param {Sinon.SinonSpy & Commit} commit
 * @returns {MutationCall[]}
 */
export const spyCommitMutations = (commit: SinonSpy & Commit): MutationCall[] => {
    return commit.getCalls().map(({args}: SinonSpyCall) => {
        return {
            name: args[0],
            payload: args.length === 2 ? args.slice(1)[0] : args.slice(1)
        };
    });
};

/**
 * Represents a committed Vuex mutation made
 */
export type MutationCall = {
    name: string;
    payload: any
};

