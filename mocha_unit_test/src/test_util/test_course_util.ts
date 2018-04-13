import {CreateCourseEntityPayload, CreateCourseIdMap} from '@shared/courses';
import {IUserInfo} from '@shared/user';
import {CreateModuleEntityPayload, CreateModuleIdMap} from '@shared/modules';
import {CreateSectionEntityPayload, SectionIdMap} from '@shared/sections';
import {ContentQuestionsDelta} from '@shared/training';
import {CommandMetaData, CommandType} from "@shared/entity";
import {createdQuestionOptionPlaceholderId, createdQuestionPlaceholderId, createdQuillPlaceholderId} from "@shared/ids";
import {appendUUID} from "@test-shared/src/uuid_generator";
import Delta from "quill-delta";
import {AnswerType, QuestionType} from "@shared/questions";
import {toAddDeltaArrOps} from "@shared/delta/diff_key_array";
import {accountHandler, coursesHandler} from "@server/config/handler_config";

export let latestUser;
export const createUser = async (username?: string): Promise<IUserInfo> => {
    username = username ? username : appendUUID('username');
    let userInfo = await accountHandler.signup({username});
    latestUser = userInfo.id;
    return userInfo;
};

export const DEFAULT_COMMAND_METADATA = (userId = latestUser.id): CommandMetaData<CommandType.course> => {
    return {
        type: CommandType.course,
        userId: userId,
        timestamp: new Date().toUTCString(),
        correlationId: '1',
        id: 'NEW',
        version: 0
    };
};

export const EMPTY_CONTENT_QUESTIONS_DELTA: ContentQuestionsDelta = {
    quillChanges: {},
    questionChanges: {},
    orderedContentQuestionIds: [],
    orderedContentIds: [],
    orderedQuestionIds: []
};

export const STUB_QUESTION_ID = createdQuestionPlaceholderId();
export const STUB_OPTION_ID_1 = createdQuestionOptionPlaceholderId();
export const STUB_OPTION_ID_2 = createdQuestionOptionPlaceholderId();
export const STUB_QUESTION: ContentQuestionsDelta = ((): ContentQuestionsDelta => {
    const questionQuillId = createdQuillPlaceholderId();
    const optionQuillId1 = createdQuillPlaceholderId();
    const explanationQuillId1 = createdQuillPlaceholderId();
    const optionQuillId2 = createdQuillPlaceholderId();
    const explanationQuillId2 = createdQuillPlaceholderId();
    return {
        quillChanges: {
            [questionQuillId]: new Delta().insert('Is this a question?'),
            [optionQuillId1]: new Delta().insert('Yes'),
            [explanationQuillId1]: new Delta().insert('You\'re right!'),
            [optionQuillId2]: new Delta().insert('No'),
            [explanationQuillId2]: new Delta().insert('Wrong!')
        },
        questionChanges: {
            [STUB_QUESTION_ID]: {
                questionQuillId: questionQuillId,
                answerInOrder: false,
                answerType: AnswerType.DEFAULT,
                questionType: QuestionType.DEFAULT,
                canPickMultiple: false,
                correctOptionIds: toAddDeltaArrOps([STUB_OPTION_ID_1]),
                optionIds: toAddDeltaArrOps([STUB_OPTION_ID_1, STUB_OPTION_ID_2]),
                optionChangesObject: {
                    [STUB_OPTION_ID_1]: {
                        optionQuillId: optionQuillId1,
                        explanationQuillId: explanationQuillId1
                    },
                    [STUB_OPTION_ID_2]: {
                        optionQuillId: optionQuillId2,
                        explanationQuillId: explanationQuillId2
                    }
                },
                randomizeOptionOrder: true
            }
        },
        orderedContentQuestionIds: toAddDeltaArrOps([STUB_QUESTION_ID]),
        orderedContentIds: [],
        orderedQuestionIds: toAddDeltaArrOps([STUB_QUESTION_ID])
    }
})();

export const STUB_CONTENT_ID = createdQuillPlaceholderId();
export const STUB_CONTENT: ContentQuestionsDelta = ((): ContentQuestionsDelta => {
    return {
        quillChanges: {
            [STUB_CONTENT_ID]: new Delta().insert('Some stubby content')
        },
        questionChanges: {},
        orderedQuestionIds: [],
        orderedContentIds: toAddDeltaArrOps([STUB_CONTENT_ID]),
        orderedContentQuestionIds: toAddDeltaArrOps([STUB_CONTENT_ID])
    }
})();

export const STUB_CONTENT_QUESTIONS: ContentQuestionsDelta = ((): ContentQuestionsDelta => {
    return {
        quillChanges: {...STUB_QUESTION.quillChanges, ...STUB_CONTENT.quillChanges},
        questionChanges: {...STUB_QUESTION.questionChanges},
        orderedContentIds: [...STUB_CONTENT.orderedContentIds],
        orderedQuestionIds: [...STUB_QUESTION.orderedQuestionIds],
        orderedContentQuestionIds: [...STUB_CONTENT.orderedContentIds, ...STUB_QUESTION.orderedQuestionIds]
    };
})();


export const STUB_COURSE = {
    title: 'created course',
    description: 'Course description',
    openEnrollment: true,
    active: true,
    submitIndividually: false,
    timeEstimate: 120,
    contentQuestions: EMPTY_CONTENT_QUESTIONS_DELTA
};

let latestCourseId;
export const createCourse = async (course?: CreateCourseEntityPayload): Promise<CreateCourseIdMap> => {
    let createdCourseIdMap = await coursesHandler.createCourse(course ? course : {...STUB_COURSE, userId: latestUser});
    latestCourseId = createdCourseIdMap.courseId;
    return createdCourseIdMap;
};

export const STUB_MODULE = {
    description: 'Module description blerg',
    timeEstimate: 60,
    title: 'A Module',
    active: true,
    submitIndividually: true,
    contentQuestions: EMPTY_CONTENT_QUESTIONS_DELTA
};
export const moduleEntity = (module = STUB_MODULE, courseId = latestCourseId): CreateModuleEntityPayload => {
    return {
        courseId,
        ...STUB_MODULE
    };
};
let latestModuleId;
export const addModule = async (module: CreateModuleEntityPayload = moduleEntity()): Promise<CreateModuleIdMap> => {
    let idMap = await coursesHandler.createModule(module);
    latestModuleId = idMap.moduleId;
    return idMap;
};

export const STUB_SECTION = {
    description: 'this is a section description',
    timeEstimate: 60,
    title: 'Awesome Section',
    active: true,
    submitIndividually: true,
    contentQuestions: EMPTY_CONTENT_QUESTIONS_DELTA
};

export const createSectionPayload = ({section = STUB_SECTION, courseId = latestCourseId, moduleId = latestModuleId}): CreateSectionEntityPayload => {
    return {
        courseId, moduleId,
        ...STUB_SECTION
    };
};
export const addSection = async (section: CreateSectionEntityPayload = createSectionPayload({})): Promise<SectionIdMap> => {
    return await coursesHandler.createSection(section);
};

export const EMPTY_CHANGES_OBJ = {
    quillChanges: {},
    questionChanges: {},
    orderedContentIds: [],
    orderedQuestionIds: [],
    orderedContentQuestionIds: []
};

