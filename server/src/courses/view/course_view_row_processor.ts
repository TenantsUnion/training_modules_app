import {ViewModuleData} from '@shared/modules';
import {ViewCourseData} from '@shared/courses';
import {QuestionQuillData, QuestionTransferData} from "@shared/questions";
import {ViewTrainingEntity, ViewTrainingEntityDescription} from "@shared/training_entity";
import {QuillEditorData, QuillTransferData} from "@shared/quill_editor";

export interface ViewTrainingEntityDbData {
    id: string;
    title: string;
    version: number;
    description?: string;
    timeEstimate?: number;
    active: boolean;
    answerImmediately?: boolean;
    orderedContentIds: string[],
    orderedQuestionIds: string[],
    orderedContentQuestionIds: string[],
    lastModifiedAt: string;
    createdAt: string;
    content: QuillTransferData[],
    questions: QuestionTransferData[]
}

export interface ViewCourseDbData extends ViewTrainingEntityDbData {
    openEnrollment: boolean,
    orderedModuleIds: string[],
    modules: ViewModuleDbData[]
}

export interface ViewModuleDbData extends ViewTrainingEntityDbData {
    orderedSectionIds: string[],
    sections: ViewTrainingEntityDescription[]
}

/**
 * Processes the row ViewCourseTransfer data by ordering the modules, questions, and content fields
 * @param {ViewCourseTransferData} row
 * @returns {ViewCourseTransferData}
 */
export const processCourseView = (row: ViewCourseDbData): ViewCourseData => {
    // modules aren't pulled out in order since results are narrowed down via 'WHERE'
    // clause and then automatically joined with ON TRUE. Have to manually order according
    // to orderedModuleIds property
    let modules = row.modules ? row.modules: [];
    let {content, questions, orderedModuleIds, ...viewCourse} = row;
    return {
        ...viewCourse,
        contentQuestions: processContentQuestions(row),
        modules: orderEntitiesByIds(orderedModuleIds, toEntityMap(modules)).map((module) => {
            let sections = module.sections ? module.sections : [];
            let orderedSections: ViewTrainingEntityDescription[] =
                orderEntitiesByIds(module.orderedSectionIds, toEntityMap(sections))
                    .map((section) => {
                        let {...viewSection} = section;
                        return {...viewSection};
                    });
            let {...viewModule} = module;
            return {
                ...viewModule, sections: orderedSections,
            };
        })
    };
};

export const processContentQuestions = (row: ViewTrainingEntityDbData): (QuillEditorData | QuestionQuillData)[] => {
    let questionsOptionsOrdered: QuestionTransferData[] = row.questions ?  row.questions
        .map((q) => ({...q, options: orderEntitiesByIds(q.optionIds, toEntityMap(q.options))})) : [];
    let content = row.content ? row.content : [];
    return orderEntitiesByIds(row.orderedContentQuestionIds, toEntityMap([...content, ...questionsOptionsOrdered]))
};

const toEntityMap = <T extends { id: string }> (objects: T[]): { [index: string]: T } => {
    return objects.reduce((acc, el) => {
        acc[el.id] = el;
        return acc;
    }, {});
};

const orderEntitiesByIds = (orderedIds: string[], objectMap: { [p: string]: { id: string } }): any[] => {
    return orderedIds.map((id) => objectMap[id]);
};
