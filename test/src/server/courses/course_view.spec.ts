import {expect} from 'chai';
import {clearData} from '../test_db_util';
import {createCourse, createUser, latestUser} from './test_course_util';
import {courseViewQuery} from '../../../../server/src/config/query_service_config';
import {CreateCourseEntityPayload, ViewCourseTransferData} from '@shared/courses';
import {
    createdQuestionOptionPlaceholderId,
    createdQuestionPlaceholderId,
    createdQuillPlaceholderId
} from '@shared/quill_editor';
import {Delta} from '@shared/normalize_imports';
import {AnswerType, QuestionChanges, QuestionType} from '@shared/questions';
import {toAddDeltaArrOps} from '@shared/delta/diff_key_array';
import * as MockDate from 'mockdate';
import {toDbTimestampFormat} from "../../../../server/src/repository";

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

    let contentText = `Content text`;
    let questionText = `Some question text`;
    let optionText1 = `Option 1 Text`;
    let explanationText1 = `Explanation 1 Text`;
    let optionText2 = `Option 2 Text`;
    let explanationText2 = `Explanation 2 Text`;

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

    it('should load a course that has 1 question and 1 content segment', async function () {
        let data: CreateCourseEntityPayload = {
            ...basicCourseProps,
            contentQuestions: {
                quillChanges: {
                    [contentQuillId]: new Delta().insert(contentText),
                    [questionQuillId]: new Delta().insert(questionText),
                    [optionQuillId1]: new Delta().insert(optionText1),
                    [explanationQuillId1]: new Delta().insert(explanationText1),
                    [optionQuillId2]: new Delta().insert(optionText2),
                    [explanationQuillId2]: new Delta().insert(explanationText2)
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
            },
        };
        let idMap = await createCourse(latestUser.id, data);
        let course = await courseViewQuery.loadAdminCourse(idMap.courseId);

        expect(course).to.deep.eq(<ViewCourseTransferData> {
            id: idMap.courseId,
            version: 0,
            lastModifiedAt: nowTimestamp,
            createdAt: nowTimestamp,
            ...basicCourseProps,
            headerDataId: null,
            modules: [],
            orderedModuleIds: [],
            orderedContentIds: [idMap[contentQuillId]],
            orderedQuestionIds: [idMap[questionId]],
            orderedContentQuestionIds: [contentQuillId, questionId].map((id) => idMap[id]),
            questions: [{
                id: idMap[questionId],
                version: 0,
                createdAt: nowTimestamp,
                lastModifiedAt: nowTimestamp,
                questionQuillId: idMap[questionQuillId],
                ...basicQuestionProps,
                optionIds: [optionId1, optionId2].map((id) => idMap[id]),
                correctOptionIds: [idMap[optionId2]],
                options: [{
                    id: idMap[optionId1],
                    version: 0,
                    optionQuillId: idMap[optionQuillId1],
                    explanationQuillId: idMap[explanationQuillId1],
                    lastModifiedAt: nowTimestamp,
                    createdAt: nowTimestamp

                }, {
                    id: idMap[optionId2],
                    version: 0,
                    optionQuillId: idMap[optionQuillId2],
                    explanationQuillId: idMap[explanationQuillId2],
                    lastModifiedAt: nowTimestamp,
                    createdAt: nowTimestamp
                }]
            }]
        });
    });
});