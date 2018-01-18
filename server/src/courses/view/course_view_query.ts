import * as _ from 'underscore';
import {LoggerInstance} from 'winston';
import {getLogger} from '../../log';
import {Datasource} from '../../datasource';
import {
    AdminCourseDescription, EnrolledCourseDescription, UserEnrolledCourseData,
    ViewCourseTransferData
} from '../../../../shared/courses';
import {processRow} from '../course_row_processor';

export class CourseViewQuery {
    logger: LoggerInstance = getLogger('CourseRepository', 'info');

    constructor(private datasource: Datasource) {}

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
            // language=PostgreSQL
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
}
