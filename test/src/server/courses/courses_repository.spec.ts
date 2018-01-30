import {expect} from 'chai';
import {CourseInsertDbData} from "../../../../server/src/courses/courses_repository";
import {coursesRepository, quillRepository} from "../../../../server/src/config/repository_config";
import * as MockDate from 'mockdate';
import {CourseEntity} from "@shared/courses";
import * as Moment from 'moment';
import {Delta} from '@shared/normalize_imports';
import {clearData} from "../test_db_util";
import {TIMESTAMP_FORMAT, toDbTimestampFormat} from "../../../../server/src/repository";

describe('Courses Repository', function () {
    let now = new Date();
    let nowTimestamp = toDbTimestampFormat(now);
    beforeEach(async function () {
        MockDate.set(now);
        await clearData();
    });

    let courseData: CourseInsertDbData = {
        title: 'The best course',
        description: 'A descriptive description',
        active: true,
        openEnrollment: true,
        timeEstimate: 60,
        orderedContentIds: ['c1', 'c2', 'c3'],
        orderedQuestionIds: ['q1', 'cq', 'q3'],
        orderedContentQuestionIds: ['c1', 'c2', 'cq', 'q1', 'cq', 'c3']
    };

    let defaultCourseProps = {
        createdAt: nowTimestamp,
        lastModifiedAt: nowTimestamp,
        headerDataId: null,
        version: 0,
        orderedModuleIds: []
    };

    it('should create a course', async function () {
        let courseId = await coursesRepository.createCourse(courseData);
        let createdCourse = await coursesRepository.loadCourseEntity(courseId);
        expect(createdCourse).to.deep.eq(<CourseEntity>{
            id: courseId,
            ...defaultCourseProps,
            ...courseData
        });
    });

    it('should update the last modified date of a course', async function () {
        let courseId = await coursesRepository.createCourse(courseData);
        let updated = Moment(now).add(1, 'hour').toDate();
        MockDate.set(updated);

        await coursesRepository.updateLastModified(courseId);
        expect(await coursesRepository.loadCourseEntity(courseId)).to.deep.eq({
            id: courseId,
            ...courseData, ...defaultCourseProps,
            lastModifiedAt: toDbTimestampFormat(updated),
        });
    });

    it('should add two modules in order to a specified course', async function () {
        let moduleId1 = 'MO1';
        let moduleId2 = 'MO2';

        let courseId = await coursesRepository.createCourse(courseData);

        await coursesRepository.addModule(courseId, moduleId1);
        await coursesRepository.addModule(courseId, moduleId2);
        expect(await coursesRepository.loadCourseEntity(courseId)).to.deep.eq({
            id: courseId,
            ...courseData, ...defaultCourseProps,
            orderedModuleIds: [moduleId1, moduleId2]
        });
    });

    it('should create a course and save it with changed data', async function() {
        let courseId = await coursesRepository.createCourse(courseData);
        let updated = Moment(now).add(1, 'hour');
        MockDate.set(updated);

        let quillId = 'QD4';
        // create quill data to satisfy FK constraint on header_data_id column
        await quillRepository.insertEditorJson(quillId, new Delta().insert('something or other'));
        let courseUpdate: CourseEntity = {
            id: courseId,
            version: 0,
            headerDataId: 'QD4',
            active: false,
            timeEstimate: 100000,
            description: 'A very different description',
            title: 'This is a better title than before',
            openEnrollment: false,
            orderedModuleIds: ['MO2'],
            orderedContentIds: ['QD1', 'QD3', 'QD4'],
            orderedQuestionIds: ['QU1'],
            orderedContentQuestionIds: ['QU1', 'QD1', 'QD3', 'QD4']
        };

        await coursesRepository.saveCourse(courseUpdate);
        let updatedCourseEntity = await coursesRepository.loadCourseEntity(courseId);
        expect(updatedCourseEntity).to.deep.eq({
            ...courseUpdate,
            createdAt: nowTimestamp,
            lastModifiedAt: updated.format(TIMESTAMP_FORMAT)
        });
    });
});