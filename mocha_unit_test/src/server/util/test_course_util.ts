import {accountHandler, coursesHandler} from '@server/config/handler_config';
import {CreateCourseEntityPayload, CreateCourseIdMap} from '@shared/courses';
import {IUserInfo} from '@shared/user';
import {CreateModuleEntityPayload, CreateModuleIdMap} from '@shared/modules';
import {CreateSectionEntityPayload, SectionIdMap} from '@shared/sections';
import {ContentQuestionsDelta} from '@shared/training_entity';
import {appendUUID} from "@testcafe/src/util/uuid_generator";
import {CommandMetaData, CommandType} from "@shared/entity";

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

export const STUB_COURSE= {
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

