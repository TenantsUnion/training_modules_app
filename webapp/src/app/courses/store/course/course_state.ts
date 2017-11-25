import {GetterTree} from 'vuex';
import {CourseEntity} from 'courses.ts';
import {RequestStage} from 'requests';
import {RootState} from '../../../state_store';

export interface CourseState {
    courseRequests: { [id: string]: RequestStage }

    currentCourseTitle: string;
    currentCourseId: string;
    courses: { [id: string]: CourseEntity };
    isAdmin: boolean;

    // currentModuleTitle: string;
    // currentModule: ModuleEntity;
    // currentModuleTransfer: ViewModuleTransferData;

    // currentSectionTitle: string;
    // currentSection: SectionEntity;
    // currentSectionTransfer: ViewSectionTransferData;
}

export type CourseGetters = GetterTree<CourseState, RootState>;
export interface CourseGetterProperties {
    currentCourse:  CourseEntity,
    currentCourseLoading: boolean
}


export const courseGetters: CourseGetters = {
    currentCourse: (state) => state.courses[state.currentCourseId],
    currentCourseLoading: (state) => state.courseRequests[state.currentCourseId] === 'WAITING'
};

export const courseState: CourseState = {
    // change with Vue.set since new properties will be set... or init as new object?
    courseRequests: {},
    currentCourseId: '',
    currentCourseTitle: '',
    courses: {},
    // currentCourse: {
    //     id: '',
    //     title: '',
    //     version: '',
    //     description: '',
    //     timeEstimate: '',
    //     lastModifiedAt: null,
    //     orderedContentIds: [],
    //     orderedQuestionIds: [],
    //     orderedContentQuestionIds: [],
    //     content: [],
    //     questions: [],
    //     active: false,
    //     openEnrollment: false,
    //     orderedModuleIds: [],
    //     modules: [],
    //     fieldDeltas: {}
    // },
    isAdmin: false,

    // currentModuleTitle: '',
    // // currentModule: {
    // //     id: '',
    // //     title: '',
    // //     version: '',
    // //     description: '',
    // //     timeEstimate: '',
    // //     lastModifiedAt: null,
    // //     orderedContentIds: [],
    // //     orderedQuestionIds: [],
    // //     orderedContentQuestionIds: [],
    // //     content: [],
    // //     questions: [],
    // //     orderedSectionIds: [],
    // //     sections: [],
    // //     fieldDeltas: {},
    // // },
    // currentModule: null, // try to be reactive with uninitialized objects first... see if they need to be initialized to blank fields
    // currentModuleTransfer: null,

    // currentSectionTitle: '',
    // currentSection: {
    //     id: '',
    //     title: '',
    //     version: '',
    //     description: '',
    //     timeEstimate: '',
    //     lastModifiedAt: null,
    //     orderedContentIds: [],
    //     orderedQuestionIds: [],
    //     orderedContentQuestionIds: [],
    //     content: [],
    //     questions: [],
    //     fieldDeltas: {
    // },
    // currentSection: null, // try to be reactive with uninitialized objects first... see if they need to be initialized to blank fields
    // currentSectionTransfer: null,
};