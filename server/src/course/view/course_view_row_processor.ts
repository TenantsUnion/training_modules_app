import {ViewCourseData} from '@shared/courses';
import {QuestionQuillData} from "@shared/questions";
import {ViewTrainingEntityDescription} from "@shared/training_entity";
import {QuillEditorData} from "@shared/quill_editor";
import {QuestionOptionDbData, QuestionViewDbData} from "./view_database";
import {orderEntitiesByIds, toEntityMap} from "@util/id_entity";

export interface ViewTrainingEntityDescriptionDbData {
    id: string;
    title: string;
    version: number;
    description?: string;
    timeEstimate?: number;
    active: boolean;
    answerImmediately?: boolean;
    lastModifiedAt: string;
    createdAt: string;
}

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
    content: QuillEditorData[],
    questions: QuestionViewDbData[]
}


export interface ViewCourseDbData extends ViewTrainingEntityDbData {
    openEnrollment: boolean,
    orderedModuleIds: string[],
    modules: ViewModuleDescriptionDbData[]
}

export interface ViewModuleDescriptionDbData extends ViewTrainingEntityDescriptionDbData {
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
    let modules = row.modules ? row.modules : [];
    let {
        orderedContentIds, orderedQuestionIds, orderedContentQuestionIds,
        content, questions, orderedModuleIds, ...viewCourse
    } = row;
    return {
        ...viewCourse,
        contentQuestions: processContentQuestions(row),
        modules: processModuleDescriptions(orderedModuleIds, modules)
    };
};

export const processModuleDescriptions = (orderedModuleIds: string[], modules: ViewModuleDescriptionDbData[]) => {
    return orderEntitiesByIds(orderedModuleIds, toEntityMap(modules)).map((module) => {
        let sections = module.sections ? module.sections : [];
        let orderedSections: ViewTrainingEntityDescription[] =
            orderEntitiesByIds(module.orderedSectionIds, toEntityMap(sections))
                .map((section) => {
                    return section;
                });
        return {
            ...module, sections: orderedSections,
        };
    });
}

export const processContentQuestions = (row: ViewTrainingEntityDbData): (QuillEditorData | QuestionQuillData)[] => {
    let questionsOptionsOrdered: QuestionQuillData[] = row.questions ? row.questions
        .map((q) => {
            let {optionIds, questionQuillId, ...rest} = q;
            let options = q.options ? q.options : [];
            let withoutQuillIds = orderEntitiesByIds(q.optionIds, toEntityMap(options)).map((option: QuestionOptionDbData) => {
                let {explanationQuillId, optionQuillId, ...rest} = option;
                return rest;
            });
            return {
                ...rest, options: orderEntitiesByIds(q.optionIds, toEntityMap(withoutQuillIds))
            }
        }) : [];
    let content = row.content ? row.content : [];

    return orderEntitiesByIds(row.orderedContentQuestionIds, toEntityMap([...content, ...questionsOptionsOrdered]))
};

