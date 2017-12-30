import {accountHandler, coursesHandler} from '../../../../server/src/config/handler_config';
import {
    CourseEntityCommandMetadata, CreateCourseEntityPayload
} from '../../../../shared/courses';
import {IUserInfo} from '../../../../shared/user';
import {CreateModuleEntityPayload} from '../../../../shared/modules';
import {CreateSectionEntityPayload} from '../../../../shared/sections';

let latestUser;
export const createUser = async (username = 'user1'): Promise<IUserInfo> => {
    latestUser = await accountHandler.signup({username});
    return latestUser;
};

let commandMetadata = (userId = latestUser.id): CourseEntityCommandMetadata => {
    return {
        type: 'CourseEntity',
        userId: userId,
        timestamp: new Date().toUTCString(),
        correlationId: '1',
        id: 'NEW',
        version: '0'
    };
};

let courseEntity = {
    title: 'created course',
    timeEstimate: '60',
    description: 'Course description',
    openEnrollment: true,
    active: true,
    orderedContentQuestions: []
};
let latestCourse;
export const createCourse = async (userId = latestUser.id, course: CreateCourseEntityPayload = courseEntity): Promise<string> => {
    let createCourseCommand = {
        metadata: commandMetadata(userId),
        payload: course
    };
    let {id} = await coursesHandler.createCourse(createCourseCommand);
    latestCourse = id;
    return id;
};

export const DEFAULT_MODULE = {
    description: 'Module description blerg',
    timeEstimate: 60,
    title: 'A Module',
    active: true
};
export const moduleEntity = (module = DEFAULT_MODULE, courseId = latestCourse): CreateModuleEntityPayload => {
    return {
        courseId,
        orderedContentQuestions: [],
        ...DEFAULT_MODULE
    };
};
let latestModule;
export const addModule = async (module: CreateModuleEntityPayload = moduleEntity()): Promise<string> => {
    let {moduleId} = await coursesHandler.createModule(module);
    latestModule = moduleId;
    return moduleId;
};

export const DEFAULT_SECTION = {
    description: 'this is a section description',
    timeEstimate: 60,
    title: 'Awesome Section',
    orderedContentQuestions: []
};
export const sectionEntity = (section = DEFAULT_SECTION, courseId = latestCourse, moduleId = latestModule): CreateSectionEntityPayload => {
    return {
        courseId, moduleId,
        ...DEFAULT_SECTION
    };
};
let latestSection;
export const addSection = async (section: CreateSectionEntityPayload = sectionEntity()): Promise<string> => {
    let {sectionId} = await coursesHandler.createSection(section);
    latestSection = sectionId;
    return sectionId;
};

export const EMPTY_CHANGES_OBJ = {
    changeQuillContent: {},
    orderedSectionIds: [],
    orderedContentIds: [],
    orderedQuestionIds: [],
    orderedContentQuestionIds: []
};
