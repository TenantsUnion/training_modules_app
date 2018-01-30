import {expect} from 'chai';
import {
    processContentQuestions,
    processCourseView, ViewCourseDbData, ViewModuleDbData,
    ViewTrainingEntityDbData
} from "../../../../../server/src/courses/view/course_view_row_processor";
import {getUTCNow} from "../../../../../server/src/repository";
import {QuillTransferData} from "@shared/quill_editor";
import {AnswerType, QuestionOptionTransferData, QuestionTransferData, QuestionType} from "@shared/questions";

describe('Course View Row Processor', function () {


    const moduleId1 = 'M1';
    const moduleId2 = 'M2';
    const moduleId3 = 'M3';

    const moduleOrder = [moduleId1, moduleId2, moduleId3];
    it('should order the modules of a course according to orderedModuleIds', function () {
        let row: ViewCourseDbData = {
            ...trainingEntityDbData('C1'),
            openEnrollment: false,
            orderedModuleIds: moduleOrder,
            modules: [moduleId3, moduleId2, moduleId1].map((id) => viewModuleDbData(id))
        };

        expect(processCourseView(row).modules.map(({id}) => id)).to.deep.eq(moduleOrder);
    });

    it('should order the sections of a module according to orderedSectionIds', function () {
        let sectionIds1 = Array(4).fill(null).map((el, index) => 'S1-' + index);
        let sections1 = [...sectionIds1].reverse().map(trainingEntityDbData);
        let sectionIds2 = Array(4).fill(null).map((el, index) => 'S2-' + index);
        let sections2 = [...sectionIds2].reverse().map(trainingEntityDbData);

        let module1 = viewModuleDbData(moduleId1, sectionIds1, sections1);
        let module2 = viewModuleDbData(moduleId2, sectionIds2, sections2);

        let row: ViewCourseDbData = {
            ...trainingEntityDbData('C1'),
            openEnrollment: false,
            orderedModuleIds: [module1.id, module2.id],
            modules: [module2, module1],
        };
        let {modules} = processCourseView(row);
        expect(modules[0].sections.map(({id}) => id)).to.deep.eq(sectionIds1);
        expect(modules[1].sections.map(({id}) => id)).to.deep.eq(sectionIds2);
    });

    it('should order the content, questions', function () {
        let contentId1 = 'QD1';
        let contentId2 = 'QD2';
        let contentId3 = 'QD3';
        let questionId1 = 'QU1';
        let questionId2 = 'QU2';

        let trainingEntity: ViewTrainingEntityDbData = {
            ...trainingEntityDbData('T1'),
            content: [contentId2, contentId3, contentId1].map(quillData),
            questions: [questionId2, questionId1].map((id) => questionData(id)),
            orderedContentQuestionIds: [questionId1, contentId1, contentId3, questionId2, contentId2]
        };

        expect(processContentQuestions(trainingEntity)).to.deep.eq([
            questionData(questionId1), quillData(contentId1), quillData(contentId3),
            questionData(questionId2), quillData(contentId2)
        ]);
    });

    it('should order the options of a question when processing the content questions', function () {
        let questionId1 = 'QU1';
        let optionId1 = 'QO1';
        let optionId2 = 'QO2';
        let optionId3 = 'QO3';

        let optionIds = [optionId1, optionId2, optionId3];
        let options = [optionId3, optionId1, optionId2].map(questionOptionData);
        let trainingEntity: ViewTrainingEntityDbData = {
            ...trainingEntityDbData('T1'),
            content: [],
            questions: [questionData(questionId1, optionIds, options)],
            orderedContentQuestionIds: [questionId1]
        };

        expect(processContentQuestions(trainingEntity)).to.deep.eq(
            [questionData(questionId1, optionIds, optionIds.map(questionOptionData))]
        );
    });

    it('should process an empty training entity to an empty content question array', function(){
        let trainingEntity: ViewTrainingEntityDbData = {
            ...trainingEntityDbData('T1'),
            content: [], questions: [], orderedContentQuestionIds: []
        };
    });

    /**
     * Helper Stub Functions
     */

    const trainingEntityDbData = (id: string): ViewTrainingEntityDbData => {
        return {
            id,
            title: 'a title',
            version: 0,
            description: 'a description',
            timeEstimate: 60,
            active: false,
            orderedContentIds: [],
            orderedQuestionIds: [],
            orderedContentQuestionIds: [],
            content: [],
            questions: [],
            createdAt: getUTCNow(),
            lastModifiedAt: getUTCNow()
        };
    };

    const questionData = (id: string,
                          optionIds: string[] = [],
                          options: QuestionOptionTransferData[] = []): QuestionTransferData => {
        return {
            id, optionIds, options,
            version: 0,
            questionType: QuestionType.DEFAULT,
            answerType: AnswerType.DEFAULT,
            randomizeOptionOrder: true,
            answerInOrder: true,
            canPickMultiple: true,
            correctOptionIds: [],
            questionQuillId: 'QD1',
        };
    };

    const questionOptionData = (id: string): QuestionOptionTransferData => {
        return {
            id,
            version: 0,
            explanationQuillId: 'QD1',
            optionQuillId: 'QD2'
        };
    };

    const quillData = (id: string): QuillTransferData => {
        return {id, version: 0};
    };

    const viewModuleDbData = (id: string,
                              orderedSectionIds: string[] = [],
                              sections: ViewTrainingEntityDbData[] = []): ViewModuleDbData => {
        return {...trainingEntityDbData(id), orderedSectionIds, sections};
    };
});