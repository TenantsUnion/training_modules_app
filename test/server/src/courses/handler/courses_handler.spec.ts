import {expect} from "chai";
import {getLogger} from "../../../../../server/src/log";
import * as _ from "underscore";
import {accountHandler, coursesHandler, coursesViewHandler} from "../../../../../server/src/config/handler_config";
import {testDbUtil} from "../../test_db_util";
import {CreateModuleEntityCommand, ModuleEntityType, ViewModuleTransferData} from 'modules.ts';
import {CreateSectionData} from 'sections.ts';
import {IUserInfo} from 'user';
import {AdminCourseDescription, CourseEntityType, CreateCourseEntityCommand} from 'courses.ts';
import {DeltaStatic} from 'quill';
import * as moment from "moment";
import * as Delta from 'quill-delta';
import {QuillEditorData} from '../../../../../shared/quill_editor';
import {EntityCommandMetaData} from '../../../../../shared/entity';

describe('courses handler', function () {
    let logger = getLogger('CoursesHandlerTest', 'debug');
    let username = 'username';
    let userId: IUserInfo;
    let timestamp = new Date().toUTCString();
    let editorJson1: QuillEditorData = {
        id: '0',
        editorJson: new Delta(),
        lastModified: new Date().toUTCString()
    };
    let editorJson2: QuillEditorData = {
        id: '1',
        editorJson: new Delta().insert('editor json 2'),
        lastModified: new Date().toUTCString()
    };
    let commandMetadata = {
        userId: username,
        timestamp: timestamp,
        correlationId: '1',
        id: 'NEW',
        version: '0'
    };
    let courseMetadata = {type: <CourseEntityType> 'CourseEntity', ...commandMetadata};
    let courseInfo1: CreateCourseEntityCommand = {
        metadata: {...courseMetadata},
        payload: {
            title: 'created course',
            timeEstimate: '60',
            description: 'Course description',
            openEnrollment: true,
            active: true,
            orderedContentQuestions: [editorJson1]
        }
    };
    let courseInfo2: CreateCourseEntityCommand = {
        metadata: {...courseMetadata},
        payload: {
            title: 'created course 2',
            timeEstimate: '120',
            description: 'Course description 2',
            openEnrollment: false,
            active: false,
            orderedContentQuestions: [editorJson2]
        }
    };

    let moduleMetadata: EntityCommandMetaData<ModuleEntityType> = {type: 'ModuleEntity', ...commandMetadata};

    let moduleCreator: (module) => () => CreateModuleEntityCommand = function (module) {
        let moduleFn = (courseId) => {
            let moduleEntityCommand = {
                metadata: moduleMetadata,
                payload: {
                    courseId: courseId,
                    description: module.description,
                    timeEstimate: module.timeEstimate,
                    title: module.title
                }
            };
            moduleFn.prototype = moduleEntityCommand;
            return moduleEntityCommand;
        };
        return <() => CreateModuleEntityCommand> moduleFn;
    };

    let module1: (string) => CreateModuleEntityCommand = moduleCreator({
        description: 'Module 1 description blerg',
        timeEstimate: '60',
        title: 'first module'
    });

    let module2: (string) => CreateModuleEntityCommand = moduleCreator({
        description: 'Module 2 description',
        timeEstimate: '120',
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
        timeEstimate: '60',
        title: 'first section'
    });

    let section2 = sectionCreator({
        description: 'section 2 description',
        timeEstimate: '120',
        title: 'second section'
    });

    beforeEach(async function () {
        logger.info('executing clear database');
        await testDbUtil.clearData();

        logger.info('signing up user');
        userId = await accountHandler.signup({
            username: username,
        });
        logger.info('completed before hook');
    });


    it('should create 2 courses and load the matching admin course descriptions', async function () {
        let checkCourseDescription = (expected: AdminCourseDescription, actual: AdminCourseDescription) => {
            logger.log('debug', 'Checking course descriptions');
            expect(actual.id).to.equal(expected.id);
            expect(actual.title).to.equal(expected.title);
            expect(actual.timeEstimate).to.equal(expected.timeEstimate);
        };

        let courseId1 = await coursesHandler.createCourse(courseInfo1);
        let courseId2 = await coursesHandler.createCourse(courseInfo2);


        let expectedDescriptions = [
            {id: courseId1, ...courseInfo1.payload},
            {id: courseId2, ...courseInfo2.payload}
        ];


        let adminCourses: AdminCourseDescription[] = await coursesViewHandler.getUserAdminCourses(username);
        console.log(`Admin courses: ${JSON.stringify(adminCourses, null, 2)}`);
        expect(adminCourses.length).to.equal(2);

        _.zip(expectedDescriptions, adminCourses).forEach((coursePair) => {
            checkCourseDescription(coursePair[0], coursePair[1]);
        });
    });

    it('should add a module to a course', async function () {
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
    });

    it('should add a section to a module of a course', async function () {
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
    });
});