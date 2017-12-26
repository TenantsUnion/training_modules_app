import {accountHandler, coursesHandler} from '../../../../../server/src/config/handler_config';
import {
    CourseEntityCommandMetadata, CreateCourseEntityPayload} from '../../../../../shared/courses';
import {IUserInfo} from '../../../../../shared/user';
import {CreateModuleEntityPayload} from '../../../../../shared/modules';

let latestUser;
export const createUser = async (username = 'user1'): Promise<IUserInfo> => {
    latestUser = await accountHandler.signup({username});
    return latestUser;
};

var commandMetadata = (userId = latestUser.id): CourseEntityCommandMetadata => {
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

let defaultModule = {
    description: 'Module 1 description blerg',
    timeEstimate: '60',
    title: 'first module',
    orderedContentQuestions: [],
    active: true
};
let moduleEntity = (module = defaultModule, courseId = latestCourse): CreateModuleEntityPayload => {
    return {
        courseId,
        description: 'Module 1 description blerg',
        timeEstimate: '60',
        title: 'first module',
        orderedContentQuestions: [],
        active: true
    };
};
let latestModule;
export const addModule = async (module: CreateModuleEntityPayload = moduleEntity()): Promise<string> => {
    let {moduleId} = await coursesHandler.createModule(module);
    latestModule = moduleId;
    return moduleId;
};
