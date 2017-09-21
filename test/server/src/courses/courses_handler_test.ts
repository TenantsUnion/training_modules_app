import {AdminCourseDescription, CreateCourseData} from "courses";
import {expect} from "chai";
import {IUserInfo} from "user";
import {getLogger} from "../../../../server/src/log";
import * as _ from "underscore";
import {accountHandler, coursesHandler} from "../../../../server/src/config/handler.config";
import {clearDbUtil} from "../clear_db_util";
import {CreateModuleData, ModuleData} from "../../../../shared/modules";
import {CreateSectionData} from '../../../../shared/sections';
import {coursesRepository} from '../../../../server/src/config/repository.config';

describe('courses handler', function () {
    let logger = getLogger('CoursesHandlerTest', 'debug');
    let username = 'username';
    let userId: IUserInfo;
    let courseInfo1: CreateCourseData = {
        title: 'created course',
        timeEstimate: '1 hour',
        description: 'Course description',
        createdBy: username
    };
    let courseInfo2: CreateCourseData = {
        title: 'created course 1',
        timeEstimate: '2 hours',
        description: 'Course description 2',
        createdBy: username
    };

    let moduleCreator: (module) => () => CreateModuleData = function (module) {
        let moduleFn = (courseId) => {
            return {
                courseId: courseId,
                description: module.description,
                timeEstimate: module.timeEstimate,
                title: module.title
            };
        };
        moduleFn.prototype = module;
        return <() => CreateModuleData> moduleFn;
    };

    let module1: (string) => CreateModuleData = moduleCreator({
        description: 'Module 1 description',
        timeEstimate: '1 hour',
        title: 'first module'
    });

    let module2: (string) => CreateModuleData = moduleCreator({
        description: 'Module 2 description',
        timeEstimate: '2 hours',
        title: 'second module'
    });

    let sectionCreator: (section) => (courseId, moduleId) => CreateSectionData = function (section) {
        let sectionFn = (courseId, moduleId) => {
            return {
                courseId: courseId,
                moduleId: moduleId,
                description: section.description,
                timeEstimate: section.timeEstimate,
                title: section.title
            };
        };
        sectionFn.prototype = section;
        return <(courseId, moduleId) => CreateSectionData> sectionFn;
    };


    let section1 = sectionCreator({
        description: 'section 1 description',
        timeEstimate: '1 hour',
        title: 'first section'
    });

    let section2 = sectionCreator({
        description: 'section 2 description',
        timeEstimate: '2 hours',
        title: 'second section'
    });

    beforeEach(async function () {
        return ((async () => {
            logger.info('executing clear database');
            await clearDbUtil.clearData();

            logger.info('signing up user');
            userId = await accountHandler.signup({
                username: username,
            });
            logger.info('completed before hook');
        })());
    });


    it('should create 2 courses and load the matching admin course descriptions', function () {
        return (async () => {

            let checkCourseDescription = (expected: AdminCourseDescription, actual: AdminCourseDescription) => {
                logger.log('debug', 'Checking course descriptions');
                expect(actual.id).to.equal(expected.id);
                expect(actual.title).to.equal(expected.title);
                expect(actual.timeEstimate).to.equal(expected.timeEstimate);
            };

            let courseId1 = await coursesHandler.createCourse(courseInfo1);
            let courseId2 = await coursesHandler.createCourse(courseInfo2);

            let expectedDescriptions: AdminCourseDescription[] = [
                _.extend({}, {id: courseId1}, courseInfo1),
                _.extend({}, {id: courseId2}, courseInfo2),
            ];


            let adminCourses: AdminCourseDescription[] = await coursesHandler.getUserAdminCourses(username);
            expect(adminCourses.length).to.equal(2);

            _.zip(expectedDescriptions, adminCourses).forEach((coursePair) => {
                checkCourseDescription(coursePair[0], coursePair[1]);
            });
        })().catch((e) => {
            console.log(e.stack);
            throw e;
        });
    });

    it('should add a module to a course', function () {
        return (async () => {
            let courseId = await coursesHandler.createCourse(courseInfo1);
            let checkModule = (expected: ModuleData, actual: ModuleData) => {
                expect(expected.id).to.equal(actual.id);
                expect(expected.header).to.equal(actual.header);
                expect(expected.title).to.equal(actual.title);
                expect(expected.description).to.equal(actual.description);
                expect(expected.timeEstimate).to.equal(actual.timeEstimate);
                expect(expected.lastEdited).to.equal(actual.lastEdited);
                expect(expected.sections).to.equal(actual.sections);
            };
            const moduleData1 = module1(courseId);
            const moduleData2 = module2(courseId);
            let module1Id = await coursesHandler.createModule(moduleData1);
            let module2Id = await coursesHandler.createModule(moduleData2);
            let expectedModules = [
                _.extend({}, {id: module1Id}, moduleData1),
                _.extend({}, {id: module2Id}, moduleData2)
            ];

            // todo use http://sinonjs.org/ to mock new Date() in order to be able to test lastModifiedTime being updated when course is modified

            let course = await coursesRepository.loadUserAdminCourse({
                username: username,
                courseTitle: courseInfo1.title
            });

            expect(course.modules.length).to.equal(2);
            _.zip(expectedModules, course.modules).forEach((modulePair) => {
                checkModule(modulePair[0], modulePair[1]);
            });
        })();
    });

    it('should add a section to a module of a course', function () {
        return (async () => {
            let courseId = await coursesHandler.createCourse(courseInfo1);
            logger.info('Created course');
            let moduleData = module1(courseId);
            let moduleId = await coursesHandler.createModule(moduleData);
            logger.info('created module');
            let sectionData = section1(courseId, moduleId);

            let sectionId = await coursesHandler.createSection(sectionData);
            logger.info('created section');
            let updatedModule = _.extend({}, {
                sections: [_.extend({}, {id: sectionId}, sectionData)]
            }, moduleData);

            let course = await coursesRepository.loadUserAdminCourse({
                username: username,
                courseTitle: courseInfo1.title
            });

            let module = course.modules[0];
            let section = module.sections[0];
            expect(module.sections.length).to.equal(1);
            expect('' + section.id).to.equal(sectionId);
            expect(section.title).to.equal(sectionData.title);
            expect(section.description).to.equal(sectionData.description);
            expect(section.orderedContentIds.length).to.equal(1);
        })();
    });
});