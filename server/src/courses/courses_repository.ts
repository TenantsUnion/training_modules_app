import {Datasource} from "../datasource";
import {
    AdminCourseDescription, UserEnrolledCourseData, EnrolledCourseDescription,
    ViewCourseTransferData, CreateCourseEntityPayload
} from "courses.ts";
import {AbstractRepository} from "../repository";
import {getLogger} from "../log";
import {LoggerInstance} from 'winston';
import * as _ from "underscore";
import * as moment from "moment";
import {processRow} from './course_row_processor';

export class CoursesRepository extends AbstractRepository implements CoursesRepository {
    logger: LoggerInstance = getLogger('CourseRepository', 'info');

    constructor(private datasource: Datasource) {
        super('course_id_seq', datasource);
    }

    async loadUserAdminCourses(userId: string): Promise<AdminCourseDescription[]> {
        let result = await this.datasource.query({
            text: `
                          SELECT c.id, c.title, c.description, c.time_estimate FROM tu.course c JOIN
                            (SELECT unnest(
                                     u.admin_of_course_ids) AS admin_course_id FROM
                               tu.user u WHERE u.id = $1) u
                              ON c.id = u.admin_course_id
                        `,
            values: [userId]
        });
        let processedCourses = result.map((course) => {
            return _.extend({}, course, {
                timeEstimate: '' + course.timeEstimate
            });
        });

        return processedCourses;
    }

    async loadUserEnrolledCourses(username: string): Promise<EnrolledCourseDescription[]> {
        this.logger.log('info', 'Retrieving courses for user: %s', username);

        let result = await this.datasource.query({
            text: ` SELECT id, title FROM tu.course c JOIN
                            (SELECT unnest(
                                     u.enrolled_in_course_ids) AS enrolled_course_id FROM
                               tu.user u WHERE u.username = $1) u
                              ON c.id = u.enrolled_course_id
                        `,
            values: [username]
        });

        let enrolled: EnrolledCourseDescription[] = result.map((row) => {
            return <EnrolledCourseDescription> {
                id: row.id,
                title: row.title
            };
        });

        return enrolled;
    }


    async createCourse(courseData: CreateCourseEntityPayload, quillIds: string[]): Promise<string> {
        try {
            let courseId = await this.getNextId();
            await this.datasource.query({
                text: `INSERT INTO tu.course (id, title, description, time_estimate, ordered_content_ids, ordered_content_question_ids)
                        VALUES ($1, $2, $3, $4, $5, $5)`,
                values: [courseId, courseData.title, courseData.description, courseData.timeEstimate, quillIds]
            });
            return courseId;
        } catch (e) {
            this.logger.log(`Error creating course: ${courseData.title}`, 'error');
            this.logger.log(e, 'error');
            throw e;
        }
    }

    async loadUserEnrolledCourse(courseId: string): Promise<UserEnrolledCourseData> {
        let results = await this.datasource.query({
                text: `SELECT * FROM tu.course c WHERE c.id = $1`,
                values: [courseId]
            }
        );

        return results[0];
    }

    async loadAdminCourse(courseId: string): Promise<ViewCourseTransferData> {
        let query = {
            text: `
                SELECT c.*, m.modules FROM tu.course c
                    INNER JOIN LATERAL
                    (SELECT json_agg(m.*) AS modules
                     FROM (SELECT m.*, s.sections FROM tu.module m
                          INNER JOIN LATERAL (SELECT json_agg(s.*) AS sections
                                              FROM tu.section s
                                              WHERE s.id = ANY(m.ordered_section_ids)) s
                            ON TRUE)
                            m where m.id = ANY(c.ordered_module_ids)) m ON TRUE
                  WHERE c.id = $1;
            `,
            values: [courseId]
        };
        try {
            this.logger.log('info', 'querying for admin course');
            this.logger.log('debug', `sql => ${query.text}`);
            let results = await this.datasource.query(query);
            let processedResults = results.map((row) => processRow(row));
            return <ViewCourseTransferData> processedResults[0];
        } catch (e) {
            this.logger.log('error', e);
            this.logger.log('error', e.stack);
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

    async saveCourse(course: ViewCourseTransferData): Promise<void> {
        let {id, active, title, description, timeEstimate, orderedModuleIds, orderedContentIds} = course;
        await this.sqlTemplate.query({
            text: `UPDATE tu.course SET title = $1, description = $2, time_estimate = $3,
                    active = $4, ordered_module_ids = $5, ordered_content_ids = $6, ordered_content_question_ids = $6,
                    last_modified_at = $7 where id = $8`,
            values: [title, description, timeEstimate, active, orderedModuleIds, orderedContentIds, new Date(), id]
        })
    }
}


