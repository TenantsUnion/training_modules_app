import {accountHandler, coursesHandler} from '../../../../server/src/config/handler_config';
import {
    CourseEntityCommandMetadata, CreateCourseEntityPayload
} from '../../../../shared/courses';
import {IUserInfo} from '../../../../shared/user';
import {CreateModuleEntityPayload} from '../../../../shared/modules';
import {CreateSectionEntityPayload} from '../../../../shared/sections';
import {ContentQuestionsDelta} from '../../../../shared/training_entity';

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
        version: '0'
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
    timeEstimate: '60',
    description: 'Course description',
    openEnrollment: true,
    active: true,
    contentQuestions: EMPTY_CONTENT_QUESTIONS_DELTA
};

let latestCourseId;
export const createCourse = async (userId = latestUser.id, course: CreateCourseEntityPayload = DEFAULT_COURSE_ENTITY): Promise<string> => {
    let createCourseCommand = {
        metadata: DEFAULT_COMMAND_METADATA(userId),
        payload: course
    };
    latestCourseId = await coursesHandler.createCourse(createCourseCommand);
    return latestCourseId;
};

export const DEFAULT_MODULE = {
    description: 'Module description blerg',
    timeEstimate: 60,
    title: 'A Module',
    active: true,
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
    latestModuleId = await coursesHandler.createModule(module);
    return latestModuleId;
};

export const DEFAULT_SECTION = {
    description: 'this is a section description',
    timeEstimate: 60,
    title: 'Awesome Section',
    contentQuestions: EMPTY_CONTENT_QUESTIONS_DELTA
};

export const sectionEntity = (section = DEFAULT_SECTION, courseId = latestCourseId, moduleId = latestModuleId): CreateSectionEntityPayload => {
    return {
        courseId, moduleId,
        ...DEFAULT_SECTION
    };
};
let latestSectionId;
export const addSection = async (section: CreateSectionEntityPayload = sectionEntity()): Promise<string> => {
    latestSectionId = await coursesHandler.createSection(section);
    return latestSectionId;
};

export const EMPTY_CHANGES_OBJ = {
    quillChanges: {},
    questionChanges: {},
    orderedSectionIds: [],
    orderedContentIds: [],
    orderedQuestionIds: [],
    orderedContentQuestionIds: []
};