import {expect} from "chai";
import {getLogger} from "../../../../server/src/log";
import * as _ from "underscore";
import {accountHandler, coursesHandler} from "../../../../server/src/config/handler.config";
import {clearDbUtil} from "../clear_db_util";
import {CreateModuleData, ViewModuleTransferData} from 'modules';
import {CreateSectionData} from 'shared/sections';
import {coursesRepository} from '../../../../server/src/config/repository.config';
import {IUserInfo} from 'user';
import {AdminCourseDescription, CreateCourseData} from 'courses';
import * as moment from "moment";

describe('courses handler', function () {
    let logger = getLogger('CoursesHandlerTest', 'debug');
    let username = 'username';
    let userId: IUserInfo;
    let courseInfo1: CreateCourseData = {
        title: 'created course',
        timeEstimate: '1 hour',
        description: 'Course description',
        createdBy: username,
        active: true
    };
    let courseInfo2: CreateCourseData = {
        title: 'created course 1',
        timeEstimate: '2 hours',
        description: 'Course description 2',
        createdBy: username,
        active: false

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
        description: 'Module 1 description blerg',
        timeEstimate: '1 hour',
        title: 'first module'
    });

    let module2: (string) => CreateModuleData = moduleCreator({
        description: 'Module 2 description',
        timeEstimate: '2 hours',
        title: 'second module'
    });

    let sectionCreator: (section) => (courseId: string, moduleId: string) => CreateSectionData = function (section) {
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
            let checkModule = (actual: ViewModuleTransferData, expected: ViewModuleTransferData) => {
                expect(actual.id).to.equal(expected.id);
                expect(_.isString(actual.headerContent) && !!actual.headerContent).to.be.true;
                expect(actual.title).to.equal(expected.title);
                expect(actual.description).to.equal(expected.description);
                expect(actual.timeEstimate).to.equal(expected.timeEstimate);
                expect(moment(actual.lastModifiedAt, moment.ISO_8601).isValid()).to.be.true;
                expect(actual.sections).to.deep.equal([]);
            };
            const moduleData1 = module1(courseId);
            const moduleData2 = module2(courseId);
            await coursesHandler.createModule(moduleData1);
            let course = await coursesHandler.createModule(moduleData2);
            let expectedModules = [
                _.extend({}, {id: course.modules[0].id, headerContent: course.modules[0].headerContent}, moduleData1),
                _.extend({}, {id: course.modules[1].id}, moduleData2)
            ];

            // todo use http://sinonjs.org/ to mock new Date() in order to be able to test lastModifiedTime being updated when course is modified

            expect(course.modules.length).to.equal(2);
            _.zip(course.modules, expectedModules).forEach((modulePair) => {
                checkModule(modulePair[0], modulePair[1]);
            });
        })();
    });

    it('should add a section to a module of a course', function () {
        return (async () => {
            let courseId = await coursesHandler.createCourse(courseInfo1);
            let moduleData = module1(courseId);

            let course = await coursesHandler.createModule(moduleData);
            let sectionData = section1(courseId, course.modules[0].id);

            course = await coursesHandler.createSection(sectionData);

            let module = course.modules[0];
            let section = module.sections[0];
            expect(module.sections.length).to.equal(1);
            expect(parseInt(section.id)).to.be.greaterThan(0);
            expect(section.title).to.equal(sectionData.title);
            expect(section.description).to.equal(sectionData.description);
            expect(section.orderedContentIds.length).to.equal(1);
        })();
    });
});