import {Datasource} from "../datasource";
import {
    AdminCourseDescription, UserEnrolledCourseData,
    EnrolledCourseDescription, CreateCourseData, SaveCourseData, ViewCourseTransferData
} from "courses";
import {AbstractRepository} from "../repository";
import {getLogger} from "../log";
import {LoggerInstance} from 'winston';
import {isUsernameCourseTitle, UsernameCourseTitle} from "./courses_handler";
import * as _ from "underscore";
import {ViewModuleTransferData} from '../../../shared/modules';
import {ViewSectionTransferData} from '../../../shared/sections';
import * as moment from "moment";

export interface ICoursesRepository {
    loadUserEnrolledCourse(username: string, courseId: string): Promise<UserEnrolledCourseData>;

    loadUserAdminCourse(courseId: string | UsernameCourseTitle): Promise<ViewCourseTransferData>;

    createCourse(courseData: CreateCourseData): Promise<string>;

    courseExists(courseData: CreateCourseData): Promise<boolean>;

    loadUserEnrolledCourses(userId: string): Promise<AdminCourseDescription[]>;

    loadUserAdminCourses(userId: string): Promise<AdminCourseDescription[]>;

    addModule(courseId: string, moduleId: string): Promise<void>;

    updateLastModified(courseId: string): Promise<string>;

    saveCourse(course: SaveCourseData): Promise<void>;
}

export class CoursesRepository extends AbstractRepository implements ICoursesRepository {
    logger: LoggerInstance = getLogger('CourseRepository', 'info');

    constructor(private datasource: Datasource) {
        super('course_id_seq', datasource);
    }

    async loadUserAdminCourses(username: string): Promise<AdminCourseDescription[]> {
        return new Promise<AdminCourseDescription[]>((resolve, reject) => {
            if (!username) {
                reject(`No username provided to load admin courses`)
            }

            (async () => {
                try {
                    let result = await this.datasource.query({
                        // language=PostgreSQL
                        text: `
                          SELECT c.id, c.title, c.time_estimate FROM tu.course c JOIN
                            (SELECT unnest(
                                     u.admin_of_course_ids) AS admin_course_id FROM
                               tu.user u WHERE u.username = $1) u
                              ON c.id = u.admin_course_id
                        `,
                        values: [username]
                    });
                    let processedCourses = result.map((course) => {
                       return _.extend({}, course, {
                          timeEstimate: '' + course.timeEstimate
                       });
                    });

                    resolve(processedCourses);
                } catch (e) {
                    reject(e);
                }
            })();
        });
    }

    async loadUserEnrolledCourses(username: string): Promise<EnrolledCourseDescription[]> {
        this.logger.log('info', 'Retrieving courses for user: %s', username);

        return new Promise<AdminCourseDescription[]>((resolve, reject) => {
            if (!username) {
                reject(`No username provided to load enrolled courses`);
            }

            (async () => {
                try {
                    let result = await this.datasource.query({
                        // language=PostgreSQL
                        text: `
                          SELECT id, title FROM tu.course c JOIN
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

                    resolve(enrolled);
                } catch (e) {
                    reject(e);
                }
            })();


        });
    }

    async courseExists(courseData: CreateCourseData): Promise<boolean> {
        if (!courseData.title) {
            return false;
        }

        try {
            let result = await this.datasource.query({
                text: `SELECT COUNT(*) FROM tu.course WHERE title = $1`,
                values: [courseData.title]
            });
            return result[0].count !== '0';
        } catch (e) {
            throw e
        }
    }

    async createCourse(courseData: CreateCourseData): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!courseData.title) {
                return resolve(null);
            }

            (async () => {
                try {

                    let courseId = await this.getNextId();
                    await this.datasource.query({
                        text: `INSERT INTO tu.course (id, title, description, time_estimate) VALUES ($1, $2, $3, $4)`,
                        values: [courseId, courseData.title, courseData.description, courseData.timeEstimate]
                    });
                    resolve(courseId);
                } catch (e) {
                    this.logger.log(`Error creating course: ${courseData.title}`, 'error');
                    this.logger.log(e, 'error');
                    reject(e);
                }
            })();
        });
    }

    async loadUserEnrolledCourse(courseId: string): Promise<UserEnrolledCourseData> {
        return new Promise<UserEnrolledCourseData>((resolve, reject) => {
            if (!courseId) {
                return resolve(null);
            }

            (async () => {
                try {
                    let results = await this.datasource.query({
                            text: `SELECT * FROM tu.course c WHERE c.id = $1`,
                            values: [courseId]
                        }
                    );

                    resolve(results[0]);
                } catch (e) {
                    this.logger.log('error', e);
                    this.logger.log('error', e.stack);
                    reject(e);
                }
            })();
        });
    }

    async loadUserAdminCourse(courseId: UsernameCourseTitle | string): Promise<ViewCourseTransferData> {
        let query = isUsernameCourseTitle(courseId) ? {
            text: `
                SELECT c.*, m.modules FROM tu.user u
                  INNER JOIN LATERAL
                             (SELECT *
                              FROM tu.course c WHERE c.title = $1) c
                  INNER JOIN LATERAL
                             (SELECT json_agg(m.*) AS modules FROM
                                (SELECT * FROM tu.module m
                                  INNER JOIN LATERAL (select json_agg(s.*) as sections from tu.section s
                                             where s.id = ANY(m.ordered_section_ids)) s
                                  on true)
                                m WHERE m.id = ANY(c.ordered_module_ids)) m
                    ON TRUE
                    ON c.id IN (select unnest(u.admin_of_course_ids)) WHERE u.username = $2;
                    `,
            values: [courseId.courseTitle, courseId.username]
        } : {
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
            let processedResults = results.map((row) => {
                return _.extend({}, row, {
                    id: '' + row.id,
                    // modules aren't pulled out in order since results are narrowed down via 'WHERE'
                    // clause and then automatically joined with ON TRUE. Have to manually order according
                    // to orderedModuleIds property
                    timeEstimate: '' + row.timeEstimate,
                    modules: _.chain(<ViewModuleTransferData[]> row.modules)
                        .map((module) => {
                            // fixme better way to convert integer ids to strings
                            return _.extend({}, module, {
                                id: module.id + '',
                                headerContent: module.headerContent + '',
                                timeEstimate: '' + module.timeEstimate
                            })
                        })
                        .reduce((ordered, module, index, modules) => {
                                if (!Object.keys(ordered.moduleIndex).length) {
                                    // initialize lookup
                                    ordered.moduleIndex = _.reduce(row.orderedModuleIds, (moduleIndex, moduleId, index) => {
                                        moduleIndex[moduleId + ''] = index;
                                        return moduleIndex;
                                    }, {});
                                }

                                module.sections = _.chain(<ViewSectionTransferData[]> module.sections)
                                    .map((section) => {
                                        return _.extend({}, section, {
                                            id: section.id + '',
                                            timeEstimate: '' + section.timeEstimate
                                        });
                                    })
                                    .reduce((ordered, section: ViewSectionTransferData) => {
                                        if (!Object.keys(ordered.sectionIndex).length) {
                                            // initialize lookup
                                            ordered.sectionIndex = _.reduce(module.orderedSectionIds, (sectionIndex, sectionId, index) => {
                                                sectionIndex[sectionId + ''] = index;
                                                return sectionIndex;
                                            }, {});
                                        }
                                        let sectionIndex = ordered.sectionIndex[section.id + ''];
                                        ordered.sections[parseInt(sectionIndex)] = section;
                                        return ordered;
                                    }, {
                                        sectionIndex: {},
                                        sections: []
                                    }).value().sections;

                                let moduleIndex = ordered.moduleIndex[module.id + ''];
                                ordered.modules[parseInt(moduleIndex)] = module;

                                return ordered;
                            },
                            {
                                moduleIndex: {},
                                modules: []
                            }
                        ).value().modules
                });
            });
            return processedResults[0];
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

    saveCourse(course: SaveCourseData): Promise<void> {
        const lastModified = new Date();
        return this.sqlTemplate.query({
            text: `UPDATE tu.course SET title = $1, description = $2, time_estimate = $3,
                    active = $4, ordered_module_ids = $5, last_modified_at = $6 where id = $7`,
            values: [course.title, course.description, course.timeEstimate, course.active, course.modules, lastModified, course.id]
        }).then(() => {
        });
    }

}


