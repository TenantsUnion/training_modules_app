import {accountHandler, coursesHandler} from '@server/config/handler_config';
import {
    CourseEntityCommandMetadata, CreateCourseEntityPayload, CreateCourseIdMap
} from '@shared/courses';
import {IUserInfo} from '@shared/user';
import {CreateModuleEntityPayload} from '@shared/modules';
import {CreateSectionEntityPayload} from '@shared/sections';
import {ContentQuestionsDelta} from '@shared/training_entity';

export let latestUser;
export const createUser = async (username = 'user1'): Promise<IUserInfo> => {
    latestUser = await accountHandler.signup({username});
    return latestUser;
};

export const DEFAULT_COMMAND_METADATA = (userId = latestUser.id): CourseEntityCommandMetadata => {
    return {
        type: 'CourseEntity',
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

export const DEFAULT_COURSE_ENTITY = {
    title: 'created course',
    timeEstimate: 60,
    description: 'Course description',
    openEnrollment: true,
    active: true,
    answerImmediately: false,
    contentQuestions: EMPTY_CONTENT_QUESTIONS_DELTA
};

let latestCourseId;
export const createCourse = async (userId = latestUser.id, course: CreateCourseEntityPayload = DEFAULT_COURSE_ENTITY): Promise<CreateCourseIdMap> => {
    let createCourseCommand = {
        metadata: DEFAULT_COMMAND_METADATA(userId),
        payload: course
    };
    let createdCourseIdMap = await coursesHandler.createCourse(createCourseCommand);
    latestCourseId = createdCourseIdMap.courseId;
    return createdCourseIdMap;
};

export const DEFAULT_MODULE = {
    description: 'Module description blerg',
    timeEstimate: 60,
    title: 'A Module',
    active: true,
    answerImmediately: true,
    contentQuestions: EMPTY_CONTENT_QUESTIONS_DELTA
};
export const moduleEntity = (module = DEFAULT_MODULE, courseId = latestCourseId): CreateModuleEntityPayload => {
    return {
        courseId,
        ...DEFAULT_MODULE
    };
};
let latestModuleId;
export const addModule = async (module: CreateModuleEntityPayload = moduleEntity()): Promise<string> => {
    let {moduleId} = await coursesHandler.createModule(module);
    latestModuleId = moduleId
    return moduleId;
};

export const DEFAULT_SECTION = {
    description: 'this is a section description',
    timeEstimate: 60,
    title: 'Awesome Section',
    active: true,
    answerImmediately: true,
    contentQuestions: EMPTY_CONTENT_QUESTIONS_DELTA
};

export const sectionEntity = (section = DEFAULT_SECTION, courseId = latestCourseId, moduleId = latestModuleId): CreateSectionEntityPayload => {
    return {
        courseId, moduleId,
        ...DEFAULT_SECTION
    };
};
export const addSection = async (section: CreateSectionEntityPayload = sectionEntity()): Promise<string> => {
    let {sectionId} = await coursesHandler.createSection(section);
    return sectionId;
};

export const EMPTY_CHANGES_OBJ = {
    quillChanges: {},
    questionChanges: {},
    orderedContentIds: [],
    orderedQuestionIds: [],
    orderedContentQuestionIds: []
};

