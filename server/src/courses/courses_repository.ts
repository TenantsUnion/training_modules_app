import {Datasource, datasource} from "../datasource";
import {ICourseInfo} from "courses";
import {CourseEntity, UserCoursesEntity} from "./courses";
import {AbstractRepository} from "../repository";
import {getLogger} from "../log";

export interface ICoursesRepository {
    loadCourse(courseId: string): Promise<CourseEntity>;

    createCourse(courseInfo: ICourseInfo): Promise<string>;

    courseExists(courseInfo: ICourseInfo): Promise<boolean>;

    loadUserCourses(userId: string): Promise<UserCoursesEntity>;
}

class CoursesRepository extends AbstractRepository implements ICoursesRepository {
    logger = getLogger('CourseRepository', 'info');

    loadCourseUsersSql = `
      SELECT c.id, c.title, c.open_enrollment, c.active,
        ARRAY(SELECT row_to_json(id, username)
              FROM tu.user WHERE tu.user.enrolled_in_course_ids @> $1)
          AS enrolledUsers,
        ARRAY(SELECT row_to_json(id, username)
              FROM tu.user WHERE tu.user.admin_of_course_ids @> $1)
        AS adminUsers`;

    loadCourseModulesSql = `
        
    `;

    constructor (private datasource: Datasource) {
        super('course_id_seqj', datasource);
    }

    async loadUserCourses (userId: string): Promise<UserCoursesEntity> {

        return new Promise<UserCoursesEntity>((resolve, reject) => {
            if (!userId) {
                reject(`No user id provided to load courses`);
            }

            (async () => {
                try {
                    let result = await datasource.query({
                        // language=PostgreSQL
                        text: `
                          SELECT ARRAY(SELECT row_to_json(id, title) FROM
                            tu.course WHERE
                            tu.course.id <@ tu.user.enrolled_in_course_ids)
                            AS enrolledInCourses,
                            ARRAY(SELECT row_to_json(id, title) FROM
                              tu.course WHERE
                              tu.course.id <@ tu.user.admin_of_course_ids)
                              AS adminOfCourses
                          WHERE tu.user.id = $1
                        `,
                        values: [userId]
                    });

                    let userCourses: UserCoursesEntity = {
                        userId: userId,
                        adminOfCourses: result.rows[0].adminOfCourses,
                        enrolledInCourses: result.rows[0].enrolledInCourses
                    };
                    resolve(userCourses);
                } catch (e) {
                    reject(e);
                }
            })();


        });
    }

    async courseExists (courseInfo: ICourseInfo): Promise<boolean> {
        console.log('checking course exists from courses repository');
        return new Promise<boolean>((resolve, reject) => {
            if (!courseInfo.title) {
                return resolve(false);
            }

            (async () => {
                try {
                    let result = await datasource.query({
                        text: `SELECT COUNT(*) FROM tu.course WHERE title = $1`,
                        values: [courseInfo.title]
                    });
                    resolve(result.rows[0].count !== '0');
                } catch (e) {
                    reject(e);
                }
            })();
        });
    }

    async createCourse (courseInfo: ICourseInfo): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!courseInfo.title) {
                return resolve(null);
            }

            (async () => {
                try {

                    let courseId = await this.getNextId();
                    await this.datasource.query({
                        text: `INSERT INTO tu.course (id, title, description, time_estimate) VALUES ($1, $2, $3, $4)`,
                        values: [courseId, courseInfo.title, courseInfo.description, courseInfo.timeEstimate]
                    });
                    resolve(courseId);
                } catch (e) {
                    this.logger.log(`Error creating course: ${courseInfo.title}`, 'error');
                    this.logger.log(e, 'error');
                    reject(e);
                }
            })();
        });
    }

    async loadCourse (courseId: string): Promise<CourseEntity> {
        return new Promise<CourseEntity>((resolve, reject) => {
            if (!courseId) {
                return resolve(null);
            }

            (async () => {
                try {
                    let results = await datasource.query({
                            text: `SELECT * FROM tu.course c WHERE c.id = $1`,
                            values: [courseId]
                        }
                    );

                    resolve(results.rows[0]);
                } catch (e) {
                    console.log(e);
                    console.log(e.stack);
                    reject(e);
                }
            })();
        });
    }
}

export const coursesRepository = new CoursesRepository(datasource);
