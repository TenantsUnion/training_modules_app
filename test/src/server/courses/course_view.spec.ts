import {expect} from 'chai';
import {clearData} from '../test_db_util';
import {createCourse, createUser, EMPTY_CONTENT_QUESTIONS_DELTA, latestUser} from './test_course_util';
import {courseViewQuery} from '../../../../server/src/config/query_service_config';
import {CreateCourseEntityPayload} from '@shared/courses';
import {
    createdQuillPlaceholderId, QuillEditorData
} from '@shared/quill_editor';
import {Delta} from '@shared/normalize_imports';

describe('Course view', function () {
    beforeEach(async function () {
        await clearData();
        await createUser();
    });

    xit('should load a course that has questions and content', async function () {
        let quillContent: QuillEditorData = {
            id: createdQuillPlaceholderId(),
            version: "0",
            editorJson: new Delta().insert('Some content')
        };
        // let question: CreateQuestionData = {
        //     id: createdQuestionPlaceholderId(),
        //     query: new Delta().insert("Hello?? I am asking you a question."),
        //     options: []
        // };

        let createCoursePayload: CreateCourseEntityPayload = {
            title: 'The course title',
            active: true,
            openEnrollment: false,
            description: 'This is a course description',
            timeEstimate: 75,
            contentQuestions: EMPTY_CONTENT_QUESTIONS_DELTA
        };
        let courseId = await createCourse(latestUser.id, createCoursePayload);
        let course = await courseViewQuery.loadAdminCourse(courseId);

        let expectedView = {
            id: courseId,
            active: false,
            createdAt: {},
            description: "This is a course description",
            headerDataId: null,
            lastModifiedAt: {},
            modules: [],
            openEnrollment: false,
            orderedContentIds: [],
            orderedContentQuestionIds: [],
            orderedModuleIds: [],
            orderedQuestionIds: [],
            timeEstimate: "75",
            title: "The course title",
            version: "0"
        };
        expect.fail("not implemented");
        expect(course).to.deep.eq(expectedView);
    });
});