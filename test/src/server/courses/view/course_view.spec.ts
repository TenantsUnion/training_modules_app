import {expect} from 'chai';
import {clearData} from '../../test_db_util';
import {createCourse, createUser, latestUser} from '../test_course_util';
import {courseViewQuery} from '../../../../../server/src/config/query_service_config';
import {CreateCourseEntityPayload, CreateCourseIdMap, ViewCourseData} from '@shared/courses';
import {
    createdQuestionOptionPlaceholderId,
    createdQuestionPlaceholderId,
    createdQuillPlaceholderId, QuillEditorData
} from '@shared/quill_editor';
import {Delta} from '@shared/normalize_imports';
import {AnswerType, QuestionChanges, QuestionQuillData, QuestionType} from '@shared/questions';
import {toAddDeltaArrOps} from '@shared/delta/diff_key_array';
import * as MockDate from 'mockdate';
import {toDbTimestampFormat} from "../../../../../server/src/repository";
import DeltaStatic = Quill.DeltaStatic;

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
    beforeEach(async function () {
        await clearData();
        await createUser();
        MockDate.set(now);
    });

    let basicCourseProps = {
        description: "Course description",
        title: "Course title",
        active: true,
        timeEstimate: 60,
        openEnrollment: true
    };

    let basicQuestionProps = {
        questionType: QuestionType.DEFAULT,
        answerType: AnswerType.DEFAULT,
        randomizeOptionOrder: true,
        canPickMultiple: false,
        answerInOrder: false
    };

    const contentQuill = new Delta().insert(`Content text`);
    const questionQuill = new Delta().insert(`Some question text`);
    const optionQuill1 = new Delta().insert(`Option 1 Text`);
    const explanationQuill1 = new Delta().insert(`Explanation 1 Text`);
    const optionQuill2 = new Delta().insert(`Option 2 Text`);
    const explanationQuill2 = new Delta().insert(`Explanation 2 Text`);
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
                editorJson: questionQuill
            },
            optionIds: [optionId1, optionId2].map((id) => idMap[id]),
            correctOptionIds: [idMap[optionId2]],
            options: [{
                id: idMap[optionId1],
                version: 0,
                option: {
                    id: idMap[optionQuillId1],
                    version: 0,
                    editorJson: optionQuill1
                },
                explanation: {
                    id: idMap[explanationQuillId2],
                    version: 0,
                    editorJson: explanationQuill1
                },
                lastModifiedAt: nowTimestamp,
                createdAt: nowTimestamp

            }, {
                id: idMap[optionId2],
                version: 0,
                option: {
                    id: idMap[optionQuillId2],
                    version: 0,
                    editorJson: optionQuill2
                },
                explanation: {
                    id: idMap[explanationQuillId2],
                    version: 0,
                    editorJson: explanationQuill2
                },
                lastModifiedAt: nowTimestamp,
                createdAt: nowTimestamp
            }]
        };
        return [content, question]
    };

    it('should load a course that has 1 question and 1 content segment', async function () {
        let data: CreateCourseEntityPayload = {
            ...basicCourseProps,
            contentQuestions: contentQuestionsDelta,
        };
        let idMap = await createCourse(latestUser.id, data);
        let course = await courseViewQuery.loadAdminCourse(idMap.courseId);

        expect(course).to.deep.eq(<ViewCourseData> {
            id: idMap.courseId,
            version: 0,
            lastModifiedAt: nowTimestamp,
            createdAt: nowTimestamp,
            ...basicCourseProps,
            headerDataId: null,
            modules: [],
            // orderedModuleIds: [],
            contentQuestions: expectedContentQuestions(idMap)
        });
    });
});
