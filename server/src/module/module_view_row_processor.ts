import {ViewTrainingEntityDescription} from "@shared/training_entity";
import {
    orderEntitiesByIds, processContentQuestions, toEntityMap,
    ViewTrainingEntityDbData
} from "@course/view/course_view_row_processor";
import {ViewModuleData} from "@shared/modules";

export interface ViewModuleDbData extends ViewTrainingEntityDbData {
    orderedSectionIds: string[],
    sections: ViewTrainingEntityDescription[]
}

/**
 * Processes the row ViewCourseTransfer data by ordering the modules, questions, and content fields
 * @param {ViewModuleDbData} row
 * @returns {ViewCourseTransferData}
 */
export const processModuleView = (row: ViewModuleDbData): ViewModuleData => {
    // modules aren't pulled out in order since results are narrowed down via 'WHERE'
    // clause and then automatically joined with ON TRUE. Have to manually order according
    // to orderedModuleIds property
    let sections = row.sections ? row.sections : [];
    let {
        orderedContentIds, orderedQuestionIds, orderedContentQuestionIds,
        content, questions, orderedSectionIds, ...viewModule
    } = row;
    return {
        ...viewModule,
        contentQuestions: processContentQuestions(row),
        sections: orderEntitiesByIds(orderedSectionIds, toEntityMap(sections))
    };
};

