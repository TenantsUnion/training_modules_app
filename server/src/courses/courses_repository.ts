import {Datasource} from "../datasource";
import {
    AdminCourseDescription, UserEnrolledCourseData, EnrolledCourseDescription,
    ViewCourseTransferData, CreateCourseEntityPayload, CourseEntity
} from "courses";
import {AbstractRepository} from "../repository";
import {getLogger} from "../log";
import {LoggerInstance} from 'winston';
import * as _ from "underscore";
import * as moment from "moment";
import {processRow} from './course_row_processor';
import {ContentQuestionEntity} from '../../../shared/training_entity';

export class CoursesRepository extends AbstractRepository {
    logger: LoggerInstance = getLogger('CourseRepository', 'info');

    constructor(private datasource: Datasource) {
        super('course_id_seq', datasource);
    }


    async createCourse(courseData: CreateCourseEntityPayload, contentQuestion: ContentQuestionEntity): Promise<string> {
        let {title, description, timeEstimate} = courseData;
        let {orderedContentIds, orderedQuestionIds, orderedContentQuestionIds} = contentQuestion;

        try {
            let courseId = await this.getNextId();
            await this.datasource.query({
                text: `INSERT INTO tu.course (id, title, description, time_estimate, ordered_content_ids, ordered_question_ids, ordered_content_question_ids)
                        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                values: [courseId, title, description, timeEstimate, orderedContentIds, orderedQuestionIds, orderedContentQuestionIds]
            });
            return courseId;
        } catch (e) {
            this.logger.log(`Error creating course: ${courseData.title}`, 'error');
            this.logger.log(e, 'error');
            throw e;
        }
    }

    async addModule(courseId: string, moduleId: string): Promise<void> {
        await this.sqlTemplate.query({
            text: `UPDATE tu.course SET ordered_module_ids = course.ordered_module_ids || $1 :: BIGINT WHERE id = $2`,
            values: [moduleId, courseId]
        });
    }

    updateLastModified(courseId: string): Promise<string> {
        const lastModified = moment.utc();
        let query = {
            text: `UPDATE tu.course SET last_modified_at = $1`,
            values: [lastModified]
        };
        return this.sqlTemplate.query(query).then(() => {
            return lastModified.toISOString();
        });
    }

    async saveCourse(course: CourseEntity): Promise<void> {
        let {id, active, title, description, timeEstimate, orderedModuleIds, orderedContentIds} = course;
        await this.sqlTemplate.query({
            text: `UPDATE tu.course SET title = $1, description = $2, time_estimate = $3,
                    active = $4, ordered_module_ids = $5, ordered_content_ids = $6, ordered_content_question_ids = $6,
                    last_modified_at = $7 where id = $8`,
            values: [title, description, timeEstimate, active, orderedModuleIds, orderedContentIds, new Date(), id]
        })
    }

    async loadAdminCourseEntity(courseId: string): Promise<CourseEntity> {
        let query = {
            text: `SELECT * from tu.course WHERE id = $1;`,
            values: [courseId]
        };
        return (await this.sqlTemplate.query(query))[0];
    }
}


