import {ViewModuleData, ViewModuleTransferData} from '@shared/modules';
import {ViewCourseData, ViewCourseTransferData} from '@shared/courses';
import {QuestionTransferData} from "@shared/questions";
import {ViewTrainingEntity} from "@shared/training_entity";
import {QuillTransferData} from "@shared/quill_editor";
import {ViewSectionTransferData} from "@shared/sections";

export interface ViewTrainingEntityDbData extends ViewTrainingEntity {
    content: QuillTransferData[],
    questions: QuestionTransferData[]
}

export interface ViewCourseDbData extends ViewCourseData<ViewModuleDbData>, ViewTrainingEntityDbData {
}

export interface ViewModuleDbData extends ViewModuleData<ViewTrainingEntityDbData & ViewTrainingEntity>, ViewTrainingEntityDbData {
}

/**
 * Processes the row ViewCourseTransfer data by ordering the modules, questions, and content fields
 * @param {ViewCourseTransferData} row
 * @returns {ViewCourseTransferData}
 */
export const processCourseView = (row: ViewCourseDbData): ViewCourseTransferData => {
    // modules aren't pulled out in order since results are narrowed down via 'WHERE'
    // clause and then automatically joined with ON TRUE. Have to manually order according
    // to orderedModuleIds property
    let {content, questions, ...viewCourse} = row;
    let modules = row.modules ? row.modules: [];
    return {
        ...viewCourse,
        contentQuestions: processContentQuestions(row),
        modules: orderEntitiesByIds(row.orderedModuleIds, toEntityMap(modules)).map((module: ViewModuleDbData) => {
            let sections = module.sections ? module.sections : [];
            let orderedSections: ViewSectionTransferData[] =
                orderEntitiesByIds(module.orderedSectionIds, toEntityMap(sections))
                    .map((section) => {
                        let {content, questions, ...viewSection} = section;
                        return {...viewSection, contentQuestions: processContentQuestions(section)};
                    });
            let {content, questions, ...viewModule} = module;
            return {
                ...viewModule, sections: orderedSections,
                contentQuestions: processContentQuestions(module)
            };
        })
    };
};

export const processContentQuestions = (row: ViewTrainingEntityDbData): (QuillTransferData | QuestionTransferData)[] => {
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
