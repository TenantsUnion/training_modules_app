import {expect} from 'chai';
import {
    processContentQuestions,
    processCourseView, ViewCourseDbData, ViewModuleDescriptionDbData,
    ViewTrainingEntityDbData
} from "@server/course/view/course_view_row_processor";
import {getUTCNow} from "@server/repository";
import {QuillEditorData} from "@shared/quill_editor";
import {
    AnswerType, QuestionOptionQuillData, QuestionQuillData, QuestionType
} from "@shared/questions";
import {QuestionOptionDbData, QuestionViewDbData} from "@server/course/view/view_database";
import {Delta} from '@shared/normalize_imports';

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
            questions: [questionId2, questionId1].map((id) => questionDbData(id)),
            orderedContentQuestionIds: [questionId1, contentId1, contentId3, questionId2, contentId2]
        };

        expect(processContentQuestions(trainingEntity)).to.deep.eq([
            questionQuillData(questionId1), quillData(contentId1), quillData(contentId3),
            questionQuillData(questionId2), quillData(contentId2)
        ]);
    });

    it('should order the options of a question when processing the content questions', function () {
        let questionId1 = 'QU1';
        let optionId1 = 'QO1';
        let optionId2 = 'QO2';
        let optionId3 = 'QO3';

        let optionIds = [optionId1, optionId2, optionId3];
        let options = [optionId3, optionId1, optionId2].map(questionOptionDbData);
        let trainingEntity: ViewTrainingEntityDbData = {
            ...trainingEntityDbData('T1'),
            content: [],
            questions: [questionDbData(questionId1, optionIds, options)],
            orderedContentQuestionIds: [questionId1]
        };

        expect(processContentQuestions(trainingEntity)).to.deep.eq(
            [questionQuillData(questionId1, optionIds.map(questionOptionQuillData))]
        );
    });

    it('should process an empty training entity to an empty content question array', function () {
        let trainingEntity: ViewTrainingEntityDbData = {
            ...trainingEntityDbData('T1'),
            content: [], questions: [], orderedContentQuestionIds: []
        };

        expect(processContentQuestions(trainingEntity)).to.deep.eq([]);
    });

    it('should process a question with no options', function () {
        let questionId = 'QU1';
        let trainingEntity: ViewTrainingEntityDbData = {
            ...trainingEntityDbData('T1'),
            content: [], questions: [questionDbData(questionId)], orderedContentQuestionIds: [questionId]
        };

        expect(processContentQuestions(trainingEntity)).to.deep.eq([questionQuillData(questionId)]);
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

    // optionIds defaults [] when there are no question options,
    // options defaults to null when there are no question options
    const questionDbData = (id: string,
                            optionIds: string[] = [],
                            options: QuestionOptionDbData[] = null): QuestionViewDbData => {
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
            questionQuill: quillData('QD1')
        };
    };

    const questionOptionDbData = (id: string): QuestionOptionDbData => {
        return {
            id,
            version: 0,
            explanationQuillId: 'QD1',
            explanation: quillData('QD1'),
            optionQuillId: 'QD2',
            option: quillData('QD2')
        };
    };

    const questionQuillData = (id: string, options: QuestionOptionQuillData[] = []): QuestionQuillData => {
        return {
            id, options,
            version: 0,
            questionType: QuestionType.DEFAULT,
            answerType: AnswerType.DEFAULT,
            randomizeOptionOrder: true,
            answerInOrder: true,
            canPickMultiple: true,
            correctOptionIds: [],
            questionQuill: quillData('QD1')
        };
    };

    const questionOptionQuillData = (id: string): QuestionOptionQuillData => {
        return {
            id,
            version: 0,
            explanation: quillData('QD1'),
            option: quillData('QD2')
        };
    };

    const quillData = (id: string): QuillEditorData => {
        return {id, version: 0, editorJson: new Delta().insert(`The id is ${id}`)};
    };

    const viewModuleDbData = (id: string,
                              orderedSectionIds: string[] = [],
                              sections: ViewTrainingEntityDbData[] = []): ViewModuleDescriptionDbData => {
        return {
            id,
            title: 'a title',
            version: 0,
            description: 'a description',
            timeEstimate: 60,
            active: false,
            orderedSectionIds,
            createdAt: getUTCNow(),
            lastModifiedAt: getUTCNow(), sections};
    };
});