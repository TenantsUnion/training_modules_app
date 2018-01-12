import {expect} from 'chai';
import {
    AdminCourseDescription, CourseEntityCommandMetadata, CreateCourseEntityCommand
} from '../../../../shared/courses';
import {coursesHandler, coursesViewHandler} from '../../../../server/src/config/handler_config';
import {QuillEditorData} from '../../../../shared/quill_editor';
import * as Delta from 'quill-delta';
import {clearData} from '../test_db_util';
import {IUserInfo} from '../../../../shared/user';
import {createUser, EMPTY_CONTENT_QUESTIONS_DELTA} from './test_course_util';

describe('Course Handler: Create Course', function () {
    let timestamp = new Date().toUTCString();
    let editorJson1: QuillEditorData = {
        id: 'NEW-0',
        editorJson: new Delta(),
        lastModified: new Date().toUTCString()
    };
    let editorJson2: QuillEditorData = {
        id: 'NEW-1',
        editorJson: new Delta().insert('editor json 2'),
        lastModified: new Date().toUTCString()
    };

    let courseInfo1: CreateCourseEntityCommand;
    let courseInfo2: CreateCourseEntityCommand;
    let metadata: CourseEntityCommandMetadata;
    let userInfo: IUserInfo;
    beforeEach(async function () {
        await clearData();
        userInfo = await createUser();
        metadata = {
            type: 'CourseEntity',
            userId: userInfo.id,
            timestamp: timestamp,
            correlationId: '1',
            id: 'NEW',
            version: '0'
        };
        courseInfo1 = {
            metadata,
            payload: {
                title: 'created course',
                timeEstimate: '60',
                description: 'Course description',
                openEnrollment: true,
                active: true,
                contentQuestions: EMPTY_CONTENT_QUESTIONS_DELTA
            }
        };
        courseInfo2 = {
            metadata,
            payload: {
                title: 'created course 2',
                timeEstimate: '120',
                description: 'Course description 2',
                openEnrollment: false,
                active: false,
                contentQuestions: EMPTY_CONTENT_QUESTIONS_DELTA
            }
        };
    });
    it('should create 2 courses and load the matching admin course descriptions', async function () {
        let courseId1 = await coursesHandler.createCourse(courseInfo1);
        let courseId2 = await coursesHandler.createCourse(courseInfo2);

        let expectedDescriptions: AdminCourseDescription[] = [
            {
                id: courseId1,
                title: courseInfo1.payload.title,
                description: courseInfo1.payload.description,
                timeEstimate: courseInfo1.payload.timeEstimate
            },
            {
                id: courseId2,
                title: courseInfo2.payload.title,
                description: courseInfo2.payload.description,
                timeEstimate: courseInfo2.payload.timeEstimate
            }
        ];

        let adminCourses: AdminCourseDescription[] = await coursesViewHandler.getUserAdminCourses(userInfo.id);
        expect(adminCourses.length).to.equal(2);
        expect(adminCourses[0]).to.deep.equal(expectedDescriptions[0]);
        expect(adminCourses[1]).to.deep.equal(expectedDescriptions[1]);
    });
});