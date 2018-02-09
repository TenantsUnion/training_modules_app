import {Datasource} from "../../datasource";
import {CourseEntity} from "../../../../shared/courses";
import {AbstractRepository, getUTCNow} from "../../repository";
import {getLogger} from "../../log";
import {LoggerInstance} from 'winston';

export type CourseInsertDbData = {
    title: string;
    description?: string;
    timeEstimate?: number;
    active: boolean;
    openEnrollment: boolean;
    answerImmediately?: boolean;
    headerDataId?: string;
    orderedContentIds: string[],
    orderedQuestionIds: string[],
    orderedContentQuestionIds: string[],

    [p: string]: any
};

export class CourseRepository extends AbstractRepository {
    logger: LoggerInstance = getLogger('CourseRepository', 'info');

    constructor (private datasource: Datasource) {
        super('course_id', datasource);
    }


    async createCourse (courseData: CourseInsertDbData): Promise<string> {
        let {
            title, description, timeEstimate, active, openEnrollment,
            orderedContentIds, orderedQuestionIds, orderedContentQuestionIds, headerDataId,
            answerImmediately
        } = courseData;

        let courseId = await this.getNextId();
        await this.datasource.query({
            text: `
                    INSERT INTO tu.course (
                        id, title, description, time_estimate, active, open_enrollment,
                        ordered_content_ids, ordered_question_ids, ordered_content_question_ids,
                        created_at, last_modified_at, header_data_id, answer_immediately
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10, $11, $12)`,
            values: [
                courseId, title, description, timeEstimate, active, openEnrollment,
                orderedContentIds, orderedQuestionIds, orderedContentQuestionIds, getUTCNow(), headerDataId,
                answerImmediately
            ]
        });
        return courseId;
    }

    async addModule (courseId: string, moduleId: string): Promise<void> {
        await this.sqlTemplate.query({
            text: `UPDATE tu.course SET ordered_module_ids = course.ordered_module_ids || $1 :: TEXT WHERE id = $2`,
            values: [moduleId, courseId]
        });
    }

    async updateLastModified (courseId: string) {
        let query = {
            text: `UPDATE tu.course SET last_modified_at = $1 where id = $2`,
            values: [getUTCNow(), courseId]
        };
        await this.sqlTemplate.query(query);
    }

    async saveCourse (course: CourseEntity): Promise<void> {
        let {
            id, version, active, title, description, timeEstimate, openEnrollment, orderedModuleIds,
            orderedContentIds, orderedQuestionIds, orderedContentQuestionIds, headerDataId, answerImmediately
        } = course;
        await this.sqlTemplate.query({
            // language=PostgreSQL
            text: `
              UPDATE tu.course SET title     = $1, description = $2, time_estimate = $3, active = $4,
                ordered_module_ids           = $5, ordered_content_ids = $6, ordered_question_ids = $7,
                ordered_content_question_ids = $8, last_modified_at = $9, version = $10, open_enrollment = $11,
                header_data_id               = $12, answer_immediately = $13
              WHERE id = $14
            `,
            values: [
                title, description, timeEstimate, active, orderedModuleIds, orderedContentIds, orderedQuestionIds,
                orderedContentQuestionIds, getUTCNow(), version, openEnrollment, headerDataId,
                answerImmediately, id]
        })
    }

    async loadCourseEntity (courseId: string): Promise<CourseEntity> {
        let query = {
            text: `SELECT * from tu.course WHERE id = $1;`,
            values: [courseId]
        };
        return (await this.sqlTemplate.query(query))[0];
    }
}


