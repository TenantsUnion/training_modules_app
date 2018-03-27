import _ from 'underscore';
import {ViewCourseStructure} from '@shared/courses';
import {AppGetter, RootGetters, RootState, TypedAction, VuexModule, VuexModuleConfig} from '@store/store_types';
import {titleToSlug} from '@shared/slug/title_slug_transformations';
import {GetterTree, Mutation, MutationTree} from "vuex";
import Vue from "vue";
import {COURSES_LISTING_ACTIONS} from "@webapp/user/store/courses_listing_store";
import {viewsHttpService} from "@webapp/views/views_http_service";
import {TRAINING_ACTIONS} from "@webapp/training/training_store";

export interface NavigationDescription {
    id: string,
    slug: string,
    title: string,
    description: string
}

export type ModuleNavigationDescription = NavigationDescription & { sections: NavigationDescription[] };
export type CourseNavigationDescription = NavigationDescription & { modules: ModuleNavigationDescription[] };

export interface CourseState {
    requests: { [id: string]: boolean }
    currentCourseId: string;
    currentModuleId: string;
    currentSectionId: string;
    courses: { [id: string]: ViewCourseStructure };
}

export interface CourseAccessors {
    currentCourse: ViewCourseStructure,
    currentCourseLoading: boolean,
    courseNavigationDescription: CourseNavigationDescription,

    currentModuleSlug: string;
    getModuleIdFromSlug: (string) => string;
    getModuleSlugFromId: (string) => string;


    getSectionIdFromSlug: (slugInfo: { moduleId: string, sectionSlug: string }) => string;
    getSectionSlugFromId: (idInfo: { moduleId: string, sectionId: string }) => string;

    nextSectionIdInModule: string,
    previousSectionIdInModule: string,

}

export type getSectionSlugFromIdFn = (slugInfo: { moduleId: string, sectionId: string }) => string;
export type getSectionIdFromSlugFn = (slugInfo: { moduleId: string, sectionSlug: string }) => string;
type CourseGetters = {[index in keyof CourseAccessors]: AppGetter<CourseState>} & GetterTree<CourseState, RootState>;
export const courseGetters: CourseGetters = {
    currentCourse: (state) => state.courses[state.currentCourseId],
    currentCourseLoading: (state) => state.requests[state.currentCourseId],
    courseNavigationDescription (state, {currentCourse, getSlugFromCourseId}): CourseNavigationDescription {
        if (!currentCourse) {
            return null;
        }
        let uniqueModuleTitle = currentCourse.modules.reduce((acc, {title}) => {
            acc[title] = _.isUndefined(acc[title]);
            return acc;
        }, {});
        let moduleNavigation: ModuleNavigationDescription[] = currentCourse.modules.map(({id, title, description, sections}) => {
            let uniqueSectionTitle = sections.reduce((acc, {title}) => {
                acc[title] = _.isUndefined(acc[title]);
                return acc;
            }, {});
            let sectionNavigation: NavigationDescription[] = sections.map(({id, title, description}) => {
                return {
                    id, title, description,
                    slug: titleToSlug(title, !uniqueSectionTitle[title], id)
                };
            });
            return {
                id, title, description,
                slug: titleToSlug(title, !uniqueModuleTitle[title], id),
                sections: sectionNavigation
            };
        });

        return {
            id: currentCourse.id,
            title: currentCourse.title,
            description: currentCourse.description,
            slug: getSlugFromCourseId(state.currentCourseId),
            modules: moduleNavigation
        };
    },
    getModuleIdFromSlug (state, {courseNavigationDescription}): (id: string) => string {
        if (!courseNavigationDescription) {
            return (id) => null; // noop
        }
        let moduleSlugIdMap = courseNavigationDescription.modules.reduce((acc, {slug, id}) => {
            acc[slug] = id;
            return acc;
        }, {});
        return (id) => moduleSlugIdMap[id];
    },
    getModuleSlugFromId (state, {courseNavigationDescription}): (id: string) => string {
        if (!courseNavigationDescription) {
            return (id) => null; // noop
        }
        let moduleIdSlugMap = courseNavigationDescription.modules.reduce((acc, {slug, id}) => {
            acc[id] = slug;
            return acc;
        }, {});
        return (id) => moduleIdSlugMap[id];
    },
    currentModuleSlug: ({currentModuleId}, {getModuleSlugFromId}) => getModuleSlugFromId(currentModuleId),
    nextSectionIdInModule: ({currentModuleId, currentSectionId}, {currentCourse}: RootGetters) => {
        if (!currentCourse || !currentModuleId || !currentSectionId) {
            return null;
        }

        let {sections} = currentCourse.modules.find((module) => module.id === currentModuleId);
        let index = sections ? sections.findIndex((section) => section.id === currentSectionId) : -1;

        return index !== -1 && index + 1 < sections.length ? sections[index + 1].id : null;
    },
    previousSectionIdInModule: ({currentModuleId, currentSectionId}, {currentCourse}: RootGetters) => {
        if (!currentCourse || !currentModuleId || !currentSectionId) {
            return null;
        }

        let {sections} = currentCourse.modules.find((module) => module.id === currentModuleId);
        let index = sections ? sections.findIndex((section) => section.id === currentSectionId) : -1;

        return index > 0 ? sections[index - 1].id : null; // null when there are no previous sections in module
    },
    getSectionIdFromSlug (state, {courseNavigationDescription}): getSectionIdFromSlugFn {
        if (!courseNavigationDescription) {
            return function () {
                throw new Error('Cannot determine section id when courseNavigationDescription is null');
            };
        }
        return function ({moduleId, sectionSlug}: { moduleId: string, sectionSlug: string }): string {
            let module = courseNavigationDescription.modules.find(({id}) => id === moduleId);
            let section = module.sections.find(({slug}) => slug === sectionSlug);
            return section && section.id;
        }
    },
    getSectionSlugFromId (state, {courseNavigationDescription}): getSectionSlugFromIdFn {
        if (!courseNavigationDescription) {
            return function () {
                throw new Error('Cannot determine section slug when courseNavigationDescription is null');
            }
        }
        return function ({moduleId, sectionId}: { moduleId: string, sectionId: string }): string {
            let module = courseNavigationDescription.modules.find(({id}) => id === moduleId);
            let section = module.sections.find(({id}) => id === sectionId);
            return section && section.slug;
        }
    }
};


export enum CourseMode {
    ADMIN = 'ADMIN',
    ENROLLED = 'ENROLLED',
    PREVIEW = 'PREVIEW'
}

export type CourseMutation<P> = (state: CourseState, payload: P) => any | Mutation<CourseState>;

export enum COURSE_MUTATIONS {
    SET_CURRENT_COURSE = 'SET_CURRENT_COURSE',
    SET_COURSE_REQUEST_STAGE = 'SET_COURSE_REQUEST_STAGE',
    SET_COURSE = 'SET_COURSE',
    SET_CURRENT_MODULE = 'SET_CURRENT_MODULE',
    SET_CURRENT_SECTION = 'SET_CURRENT_SECTION',
}

export interface CourseMutations extends MutationTree<CourseState> {
    SET_CURRENT_COURSE: CourseMutation<string>;
    SET_CURRENT_MODULE: CourseMutation<string>;
    SET_CURRENT_SECTION: CourseMutation<string>;
    SET_COURSE_REQUEST_STAGE: CourseMutation<{ id: string; requesting: boolean }>;
    SET_COURSE: CourseMutation<ViewCourseStructure>;
}

/**
 * Store mutations
 */
export const coursesMutations: CourseMutations = {
    SET_CURRENT_COURSE: (state: CourseState, id) => {
        state.currentCourseId = id;
    },
    SET_CURRENT_MODULE: (state: CourseState, id) => {
        state.currentModuleId = id;
    },
    SET_CURRENT_SECTION: (state: CourseState, id) => {
        state.currentSectionId = id;
    },
    SET_COURSE_REQUEST_STAGE: (state: CourseState, {id, requesting}) => {
        Vue.set(state.requests, id, requesting);
    },
    SET_COURSE: ({courses}: CourseState, courseStructure) => {
        Vue.set(courses, courseStructure.id, courseStructure);
    }
};

export type CourseAction<P, V> = TypedAction<CourseState, P, V>;
export type CourseActions = {[index in COURSE_ACTIONS]} & {
    SET_CURRENT_COURSE: CourseAction<string, void>;
    SET_CURRENT_COURSE_FROM_SLUG: CourseAction<string, void>;
    SET_CURRENT_MODULE: CourseAction<string, void>;
    SET_CURRENT_MODULE_FROM_SLUG: CourseAction<string, void>,
    SET_CURRENT_SECTION: CourseAction<{ sectionId: string, moduleId: string }, void>,
    SET_CURRENT_SECTION_FROM_SLUG: CourseAction<{ moduleId: string, sectionSlug: string }, void>,
    NEXT_SECTION: CourseAction<void, void>,
    PREVIOUS_SECTION: CourseAction<void, void>
}

/**
 * Const for using course mutation type values
 */
export enum COURSE_ACTIONS {
    SET_CURRENT_COURSE = 'SET_CURRENT_COURSE',
    SET_CURRENT_COURSE_FROM_SLUG = 'SET_CURRENT_COURSE_FROM_SLUG',
    SET_CURRENT_MODULE = 'SET_CURRENT_MODULE',
    SET_CURRENT_MODULE_FROM_SLUG = 'SET_CURRENT_MODULE_FROM_SLUG',
    SET_CURRENT_SECTION = 'SET_CURRENT_SECTION',
    SET_CURRENT_SECTION_FROM_SLUG = 'SET_CURRENT_SECTION_FROM_SLUG',
    NEXT_SECTION = 'NEXT_SECTION',
    PREVIOUS_SECTION = 'PREVIOUS_SECTION'
}

/**
 * Course store actions
 */
export const courseActions: CourseActions = {
    async SET_CURRENT_COURSE ({state, rootGetters, commit, dispatch}, id): Promise<void> {
        try {
            if (id === state.currentCourseId) {
                return; // current state matches, no changes
            }

            commit(COURSE_MUTATIONS.SET_CURRENT_COURSE, id);
            if (!rootGetters.currentCourseTrainingLoaded) {
                commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id, requesting: true});
                let course = (await viewsHttpService.loadViews({courseStructure: true, courseId: id})).courseStructure;
                commit(COURSE_MUTATIONS.SET_COURSE_REQUEST_STAGE, {id, requesting: false});
                commit(COURSE_MUTATIONS.SET_COURSE, course);
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
    async SET_CURRENT_MODULE ({commit, getters, dispatch}, id) {
        commit(COURSE_MUTATIONS.SET_CURRENT_MODULE, id);
        return dispatch(TRAINING_ACTIONS.SET_CURRENT_MODULE_TRAINING, id);
    },
    async SET_CURRENT_MODULE_FROM_SLUG ({commit, getters, dispatch}, slug) {
        return dispatch(COURSE_ACTIONS.SET_CURRENT_MODULE, (<RootGetters> getters).getModuleIdFromSlug(slug));
    },
    async SET_CURRENT_SECTION ({dispatch, state, getters, commit}, {sectionId, moduleId}) {
        try {
            if (sectionId === state.currentSectionId) {
                return; // provided id matches id of current section, no changes to state needed
            }

            commit(COURSE_MUTATIONS.SET_CURRENT_MODULE, moduleId);
            commit(COURSE_MUTATIONS.SET_CURRENT_SECTION, sectionId);
            dispatch(TRAINING_ACTIONS.SET_CURRENT_SECTION_TRAINING, sectionId);
        } catch (e) {
            console.error(e);
            throw e;
        }
    },
    async SET_CURRENT_SECTION_FROM_SLUG ({getters, dispatch}, slug: { moduleId: string, sectionSlug: string }) {
        dispatch(COURSE_ACTIONS.SET_CURRENT_SECTION, {
            moduleId: slug.moduleId,
            sectionId: (<RootGetters> getters).getSectionIdFromSlug(slug)
        });
    },
    async NEXT_SECTION ({getters, dispatch, rootState}) {
        let nextId = getters.nextSectionIdInModule;
        if (!nextId) {
            return;
        }

        await dispatch(COURSE_ACTIONS.SET_CURRENT_SECTION, {
            sectionId: nextId,
            moduleId: rootState.course.currentModuleId
        });
    },
    async PREVIOUS_SECTION ({getters, dispatch, rootState}) {
        let previousId = getters.previousSectionIdInModule;
        if (!previousId) {
            return;
        }

        await dispatch(COURSE_ACTIONS.SET_CURRENT_SECTION, {
            sectionId: previousId,
            moduleId: rootState.course.currentModuleId
        });
    },
};

export type CourseStoreConfig = VuexModuleConfig<CourseState, CourseGetters, CourseActions, CourseMutations>;
export const courseStoreConfig: CourseStoreConfig = {
    initState (): CourseState {
        return {
            requests: {},
            currentCourseId: null,
            currentModuleId: null,
            currentSectionId: null,
            courses: {},
        };
    },
    module (): VuexModule<CourseState, CourseActions, CourseGetters, CourseMutations> {
        return {
            actions: courseActions,
            mutations: coursesMutations,
            getters: courseGetters,
            state: this.initState()
        };
    }
};
