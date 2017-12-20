import * as _ from 'underscore';
import {CourseEntity} from 'courses.ts';
import {AppGetter} from '../../../state_store';
import {ViewModuleTransferData} from '../../../../../../shared/modules';
import {titleToSlug} from '../../../../../../shared/slug/title_slug_transformations';

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
    getModuleTransferData: (moduleId: string) => ViewModuleTransferData
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
    getModuleTransferData: (state, getters) => {
        return function (moduleId) {
            return getters.currentCourse.modules.find((module) => module.id === moduleId);
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
    }
};

