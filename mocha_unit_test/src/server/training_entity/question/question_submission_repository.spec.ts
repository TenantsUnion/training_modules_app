import {expect} from 'chai';
import {questionSubmissionRepository} from "@server/config/repository_config";
import {QuestionSubmission} from "@shared/user_progress";
import {questionHandler} from "@server/config/handler_config";
import {AnswerType, QuestionType} from "@shared/questions";
import {
    createdQuestionOptionPlaceholderId, createdQuestionPlaceholderId
} from "@shared/ids";
import {toAddDeltaArrOps} from "@shared/delta/diff_key_array";
import {createUser} from "../../../test_util/test_course_util";
import MockDate from 'mockdate';
import {toDbTimestampFormat} from "@server/repository";

describe('Question Submission Repository', function () {
    // option ids are placeholders and used as actual ids since options are not created since
    // the option changes object is empty (would have to create quill data for option
    // and explanations since fk is enforced)
    let optionId1 = createdQuestionOptionPlaceholderId();
    let optionId2 = createdQuestionOptionPlaceholderId();
    let placeholderQuestionId1 = createdQuestionPlaceholderId();
    let placeholderQuestionId2 = createdQuestionPlaceholderId();
    let defaultQuestionProps = {
        answerInOrder: true,
        answerType: AnswerType.DEFAULT,
        questionType: QuestionType.DEFAULT,
        canPickMultiple: true,
        correctOptionIds: toAddDeltaArrOps([optionId2]),
        optionIds: toAddDeltaArrOps([optionId1, optionId2]),
        randomizeOptionOrder: true,
        optionChangesObject: {}
    };

    const nowDate = new Date();
    const now = toDbTimestampFormat(nowDate);
    let userId;
    before(async function () {
        userId = (await createUser()).id;
    });
    beforeEach(function () {
        MockDate.set(now);
    });

    after(function () {
        MockDate.reset();
    });

    it('should insert a single question submission', async function () {
        let idMap = await questionHandler.handleQuestionChanges({[placeholderQuestionId1]: defaultQuestionProps});
        let submission: QuestionSubmission = {
            questionId: idMap[placeholderQuestionId1],
            possibleQuestionOptionIds: [optionId1, optionId2],
            chosenQuestionOptionIds: [optionId2],
            correct: true
        };
        let [id] = await questionSubmissionRepository.insertQuestionSubmissions(userId, [submission]);
        expect(await questionSubmissionRepository.loadQuestionSubmissionByQuestionId(idMap[placeholderQuestionId1])).to.deep.eq([{
            userId, id,
            textAnswer: null,
            createdAt: now,
            ...submission
        }]);
    });

    it('should insert multiple question submissions', async function () {
        let idMap = await questionHandler.handleQuestionChanges({
            [placeholderQuestionId1]: defaultQuestionProps,
            [placeholderQuestionId2]: defaultQuestionProps
        });
        let submissions: QuestionSubmission[] = [
            {
                questionId: idMap[placeholderQuestionId1],
                possibleQuestionOptionIds: [optionId1, optionId2],
                chosenQuestionOptionIds: [optionId2],
                correct: true
            }, {
                questionId: idMap[placeholderQuestionId2],
                possibleQuestionOptionIds: [optionId1, optionId2],
                chosenQuestionOptionIds: [optionId1],
                correct: false
            }
        ];
        let [id1, id2] = await questionSubmissionRepository.insertQuestionSubmissions(userId, submissions);
        expect(await questionSubmissionRepository.loadQuestionSubmissionByQuestionId(idMap[placeholderQuestionId1])).to.deep.eq([{
            ...submissions[0], userId,
            id: id1,
            textAnswer: null,
            createdAt: now
        }]);
        expect(await questionSubmissionRepository.loadQuestionSubmissionByQuestionId(idMap[placeholderQuestionId2])).to.deep.eq([{
            ...submissions[1], userId,
            id: id2,
            textAnswer: null,
            createdAt: now,
        }]);
    });
});