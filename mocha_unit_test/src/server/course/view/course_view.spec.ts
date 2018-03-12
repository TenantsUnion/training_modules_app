import {expect} from 'chai';
import {createCourse, createUser, latestUser} from '../../util/test_course_util';
import {CreateCourseEntityPayload, ViewCourseData} from '@shared/courses';
import {QuillEditorData} from '@shared/quill_editor';
import {Delta} from '@shared/normalize_imports';
import {AnswerType, QuestionChanges, QuestionQuillData, QuestionType} from '@shared/questions';
import {toAddDeltaArrOps} from '@shared/delta/diff_key_array';
import * as MockDate from 'mockdate';
import DeltaOperation = Quill.DeltaOperation;
import {createdQuestionOptionPlaceholderId, createdQuestionPlaceholderId, createdQuillPlaceholderId} from "@shared/ids";
import {toDbTimestampFormat} from "@server/repository";
import {courseViewQuery} from "@server/config/query_service_config";

describe('Course view', function () {
    let questionId = createdQuestionPlaceholderId();
    let optionId1 = createdQuestionOptionPlaceholderId();
    let optionId2 = createdQuestionOptionPlaceholderId();

    let contentQuillId = createdQuillPlaceholderId();
    let questionQuillId = createdQuillPlaceholderId();
    let optionQuillId1 = createdQuillPlaceholderId();
    let explanationQuillId1 = createdQuillPlaceholderId();
    let optionQuillId2 = createdQuillPlaceholderId();
    let explanationQuillId2 = createdQuillPlaceholderId();

    let now = new Date();
    let nowTimestamp = toDbTimestampFormat(now);
    let userId;
    beforeEach(async function () {
        userId = (await createUser()).id;
        MockDate.set(now);
    });

    let basicCourseProps = {
        description: "Course description",
        title: "Course title",
        active: true,
        timeEstimate: 60,
        submitIndividually: false,
        openEnrollment: true
    };

    let basicQuestionProps = {
        questionType: QuestionType.DEFAULT,
        answerType: AnswerType.DEFAULT,
        randomizeOptionOrder: true,
        canPickMultiple: false,
        answerInOrder: false
    };

    type OpsObj = {ops: DeltaOperation[]};
    const contentQuill: OpsObj = {ops: new Delta().insert(`Content text`).ops};
    const questionQuill: OpsObj  = {ops: new Delta().insert(`Some question text`).ops};
    const optionQuill1: OpsObj  = {ops: new Delta().insert(`Option 1 Text`).ops};
    const explanationQuill1: OpsObj  = {ops: new Delta().insert(`Explanation 1 Text`).ops};
    const optionQuill2: OpsObj  = {ops: new Delta().insert(`Option 2 Text`).ops};
    const explanationQuill2: OpsObj  = {ops: new Delta().insert(`Explanation 2 Text`).ops};
    const contentQuestionsDelta = {
        quillChanges: {
            [contentQuillId]: contentQuill,
            [questionQuillId]: questionQuill,
            [optionQuillId1]: optionQuill1,
            [explanationQuillId1]: explanationQuill1,
            [optionQuillId2]: optionQuill2,
            [explanationQuillId2]: explanationQuill2
        },
        questionChanges: {
            [questionId]: <QuestionChanges>{
                ...basicQuestionProps,
                questionQuillId: questionQuillId,
                optionIds: toAddDeltaArrOps([optionId1, optionId2]),
                correctOptionIds: toAddDeltaArrOps([optionId2]),
                optionChangesObject: {
                    [optionId1]: {
                        optionQuillId: optionQuillId1,
                        explanationQuillId: explanationQuillId1
                    },
                    [optionId2]: {
                        optionQuillId: optionQuillId2,
                        explanationQuillId: explanationQuillId2
                    }
                }
            }
        },
        orderedContentQuestionIds: toAddDeltaArrOps([contentQuillId, questionId]),
        orderedContentIds: toAddDeltaArrOps([contentQuillId]),
        orderedQuestionIds: toAddDeltaArrOps([questionId])
    };

    const expectedContentQuestions = (idMap: { [id: string]: string }): (QuestionQuillData | QuillEditorData)[] => {
        const content: QuillEditorData = {
            id: idMap[contentQuillId],
            version: 0,
            createdAt: nowTimestamp,
            lastModifiedAt: nowTimestamp,
            editorJson: contentQuill
        };


        const question: QuestionQuillData = {
            id: idMap[questionId],
            version: 0,
            createdAt: nowTimestamp,
            lastModifiedAt: nowTimestamp,
            ...basicQuestionProps,
            questionQuill: {
                id: idMap[questionQuillId],
                version: 0,
                editorJson: questionQuill,
                createdAt: nowTimestamp,
                lastModifiedAt: nowTimestamp
            },
            // optionIds: [optionId1, optionId2].map((id) => idMap[id]),
            correctOptionIds: [idMap[optionId2]],
            options: [{
                id: idMap[optionId1],
                version: 0,
                option: {
                    id: idMap[optionQuillId1],
                    version: 0,
                    editorJson: optionQuill1,
                    createdAt: nowTimestamp,
                    lastModifiedAt: nowTimestamp
                },
                explanation: {
                    id: idMap[explanationQuillId1],
                    version: 0,
                    editorJson: explanationQuill1,
                    createdAt: nowTimestamp,
                    lastModifiedAt: nowTimestamp
                },
                lastModifiedAt: nowTimestamp,
                createdAt: nowTimestamp

            }, {
                id: idMap[optionId2],
                version: 0,
                option: {
                    id: idMap[optionQuillId2],
                    version: 0,
                    editorJson: optionQuill2,
                    createdAt: nowTimestamp,
                    lastModifiedAt: nowTimestamp
                },
                explanation: {
                    id: idMap[explanationQuillId2],
                    version: 0,
                    editorJson: explanationQuill2,
                    createdAt: nowTimestamp,
                    lastModifiedAt: nowTimestamp
                },
                lastModifiedAt: nowTimestamp,
                createdAt: nowTimestamp
            }]
        };
        return [content, question]
    };

    it('should load a course that has 1 question and 1 content segment', async function () {
        let data: CreateCourseEntityPayload = {
            userId, ...basicCourseProps,
            contentQuestions: contentQuestionsDelta,
        };
        let idMap = await createCourse(data);
        let course = await courseViewQuery.loadCourseTraining(idMap.courseId);

        const expected = {
            id: idMap.courseId,
            version: 0,
            lastModifiedAt: nowTimestamp,
            createdAt: nowTimestamp,
            ...basicCourseProps,
            headerDataId: null,
            modules: [],
            // orderedModuleIds: [],
            contentQuestions: expectedContentQuestions(idMap)
        };
        expect(course).to.deep.eq(<ViewCourseData> expected);
    });
});
