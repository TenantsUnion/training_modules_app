import * as _ from 'underscore';
import {CourseEntity} from '@shared/courses';
import {AppGetter, RootGetters} from '../../../state_store';
import {titleToSlug} from '@shared/slug/title_slug_transformations';
import {ViewModuleDescription} from '@shared/modules';
import {ViewTrainingEntityDescription} from '@shared/training_entity';

export interface NavigationDescription {
    id: string,
    slug: string,
    title: string,
    description: string
}

export type ModuleNavigationDescription = NavigationDescription & { sections: NavigationDescription[] };
export type CourseNavigationDescription = NavigationDescription & { modules: ModuleNavigationDescription[] };

export interface CourseState {
    courseRequests: { [id: string]: boolean }
    currentCourseTitle: string;
    currentCourseId: string;
    courses: { [id: string]: CourseEntity };
    isAdmin: boolean;
}

export interface CourseGetters {
    currentCourse: CourseEntity,
    currentCourseLoaded: boolean,
    currentCourseLoading: boolean,
    courseNavigationDescription: CourseNavigationDescription,
    getModuleDescription: (moduleId: string) => ViewModuleDescription,
    getSectionDescription: (moduleId: string, sectionId: string) => ViewTrainingEntityDescription,
    nextSectionIdInModule: string,
    previousSectionIdInModule: string
}

export const courseState: CourseState = {
    courseRequests: {},
    currentCourseId: '',
    currentCourseTitle: '',
    courses: {},
    isAdmin: false,
};

export const courseGetters: {[index in keyof CourseGetters]: AppGetter<CourseState>} = {
    currentCourse: (state) => state.courses[state.currentCourseId],
    currentCourseLoaded: (state) => !!state.courses[state.currentCourseId],
    currentCourseLoading: (state) => state.courseRequests[state.currentCourseId],
    getModuleDescription: (state, getters) => {
        return function (moduleId) {
            return getters.currentCourse.modules.find((module) => module.id === moduleId);
        }
    },
    getSectionDescription: (state, {getModuleDescription}) => {
        return function (moduleId, sectionId) {
            return getModuleDescription(moduleId).sections.find((section) => section.id === sectionId);
        }
    },
    courseNavigationDescription(state, {currentCourse, getSlugFromCourseId}): CourseNavigationDescription {
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
    nextSectionIdInModule: (state, getters: RootGetters) => {
        let {currentCourse, currentModule, currentSection} = getters;
        if(!currentCourse || !currentModule || !currentSection){
            return null;
        }

        let index = currentModule.sections.findIndex((section) => section.id === currentSection.id);
        if(index === -1 || index + 1 === currentModule.sections.length){
            return null; // last section in module
        }

        return currentModule.sections[index + 1].id;
    },
    previousSectionIdInModule: (state, getters: RootGetters) => {
        let {currentCourse, currentModule, currentSection} = getters;
        if(!currentCourse || !currentModule || !currentSection){
            return null;
        }

        let index = currentModule.sections.findIndex((section) => section.id === currentSection.id);
        if(index <= 0){
            return null; // first section in module or section has changed but module hasn't
        }

        return currentModule.sections[index - 1].id;
    }
};

