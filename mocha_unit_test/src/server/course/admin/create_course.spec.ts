import {expect} from 'chai';
import {CourseDescription, CreateCourseEntityPayload} from '@shared/courses';
import {coursesHandler} from '@server/config/handler_config';
import {QuillEditorData} from '@shared/quill_editor';
import * as Delta from 'quill-delta';
import {createUser, EMPTY_CONTENT_QUESTIONS_DELTA} from '../../util/test_course_util';
import {getUTCNow} from "@server/repository";
import {courseViewQuery} from "@server/config/query_service_config";
import {CommandMetaData, CommandType} from "@shared/entity";

describe('Course Handler: Create Course', function () {
    let timestamp = new Date().toUTCString();
    let editorJson1: QuillEditorData = {
        id: 'NEW-0',
        version: 0,
        editorJson: new Delta(),
        lastModifiedAt: getUTCNow()
    };
    let editorJson2: QuillEditorData = {
        id: 'NEW-1',
        version: 0,
        editorJson: new Delta().insert('editor json 2'),
        lastModifiedAt: getUTCNow()
    };

    let courseInfo1: CreateCourseEntityPayload;
    let courseInfo2: CreateCourseEntityPayload;
    let metadata: CommandMetaData<CommandType.course>;
    let userId: string;
    beforeEach(async function () {
        userId = (await createUser()).id;
        metadata = {
            type: CommandType.course,
            userId: userId,
            timestamp: timestamp,
            correlationId: '1',
            id: 'NEW',
            version: 0
        };
        courseInfo1 = {
            userId,
            title: 'created course',
            timeEstimate: 60,
            description: 'Course description',
            openEnrollment: true,
            submitIndividually: false,
            active: true,
            contentQuestions: EMPTY_CONTENT_QUESTIONS_DELTA
        };
        courseInfo2 = {
            userId,
            title: 'created course 2',
            timeEstimate: 120,
            description: 'Course description 2',
            openEnrollment: false,
            submitIndividually: true,
            active: false,
            contentQuestions: EMPTY_CONTENT_QUESTIONS_DELTA
        };
    });
    it('should create 2 courses and load the matching admin course descriptions', async function () {
        let {courseId: courseId1} = await coursesHandler.createCourse(courseInfo1);
        let {courseId: courseId2} = await coursesHandler.createCourse(courseInfo2);

        let expectedDescriptions: CourseDescription[] = [
            {
                id: courseId1,
                title: courseInfo1.title,
                description: courseInfo1.description,
                timeEstimate: courseInfo1.timeEstimate
            },
            {
                id: courseId2,
                title: courseInfo2.title,
                description: courseInfo2.description,
                timeEstimate: courseInfo2.timeEstimate
            }
        ];

        let adminCourses: CourseDescription[] = await courseViewQuery.loadUserAdminCourses(userId);
        expect(adminCourses.length).to.equal(2);
        expect(adminCourses[0]).to.deep.equal(expectedDescriptions[0]);
        expect(adminCourses[1]).to.deep.equal(expectedDescriptions[1]);
    });
});