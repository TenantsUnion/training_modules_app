import {QuillEditorData} from "@shared/quill_editor";
import {QuestionData, QuestionOptionData, QuestionQuillData} from "@shared/questions";
import {orderObjByIds, toIdObjMap} from "@shared/util/id_array_util";
import {ViewTrainingEntityDescription} from "@shared/training_entity";
import {ViewCourseData} from "@shared/courses";

export interface ViewTrainingEntityDescriptionDbData {
    id: string;
    title: string;
    version: number;
    description?: string;
    timeEstimate?: number;
    active: boolean;
    submitIndividually?: boolean;
    lastModifiedAt: string;
    createdAt: string;
    orderedContentIds: string[],
    orderedQuestionIds: string[]
}

export interface ViewTrainingEntityDbData {
    id: string;
    title: string;
    version: number;
    description?: string;
    timeEstimate?: number;
    active: boolean;
    submitIndividually?: boolean;
    orderedContentIds: string[],
    orderedQuestionIds: string[],
    orderedContentQuestionIds: string[],
    lastModifiedAt: string;
    createdAt: string;
    content: QuillEditorData[],
    questions: QuestionViewDbData[]
}

export interface QuestionViewDbData extends QuestionData {
    options: QuestionOptionDbData[],
    questionQuill: QuillEditorData,
    questionQuillId: string,
    optionIds: string[]
}

export interface QuestionOptionDbData extends QuestionOptionData {
    option: QuillEditorData,
    explanation: QuillEditorData,
    optionQuillId: string;
    explanationQuillId: string;
}

export interface ViewCourseDbData extends ViewTrainingEntityDbData {
    openEnrollment: boolean,
    orderedModuleIds: string[],
    modules: ViewModuleDescriptionDbData[]
}

export interface ViewModuleDescriptionDbData extends ViewTrainingEntityDescriptionDbData {
    orderedSectionIds: string[],
    sections: ViewTrainingEntityDescriptionDbData[]
}
export const processContentQuestions = (row: ViewTrainingEntityDbData): (QuillEditorData | QuestionQuillData)[] => {
    let questionsOptionsOrdered: QuestionQuillData[] = row.questions ? row.questions
        .map((q) => {
            let {optionIds, questionQuillId, ...rest} = q;
            let options = q.options ? q.options : [];
            let withoutQuillIds = orderObjByIds(q.optionIds, toIdObjMap(options)).map((option: QuestionOptionDbData) => {
                let {explanationQuillId, optionQuillId, ...rest} = option;
                return rest;
            });
            return {
                ...rest, options: orderObjByIds(q.optionIds, toIdObjMap(withoutQuillIds))
            }
        }) : [];
    let content = row.content ? row.content : [];

    return orderObjByIds(row.orderedContentQuestionIds, toIdObjMap([...content, ...questionsOptionsOrdered]))
};

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
    return orderObjByIds(orderedModuleIds, toIdObjMap(modules)).map((module) => {
        let sections = module.sections ? module.sections : [];
        let orderedSections: ViewTrainingEntityDescription[] =
            orderObjByIds(module.orderedSectionIds, toIdObjMap(sections))
                .map((section) => {
                    return section;
                });
        return {
            ...module, sections: orderedSections,
        };
    });
}

