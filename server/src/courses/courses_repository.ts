import {Datasource, datasource} from "../datasource";
import {
    EnrolledCourseDescription,
    AdminCourseDescription, UserEnrolledCourseData, CourseData,
    UserAdminCourseData
} from "courses";
import {AbstractRepository} from "../repository";
import {getLogger} from "../log";

export interface ICoursesRepository {
    loadUserEnrolledCourse(userId: string, courseId: string): Promise<UserEnrolledCourseData>;

    loadUserAdminCourse(courseId: string)

    createCourse(courseData: CourseData): Promise<string>;

    courseExists(courseData: CourseData): Promise<boolean>;

    loadUserEnrolledCourses(userId: string): Promise<EnrolledCourseDescription[]>;

    loadUserAdminCourses(userId: string): Promise<AdminCourseDescription[]>;
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
        super('course_id_seq', datasource);
    }

    async loadUserAdminCourses (username: string): Promise<AdminCourseDescription[]>{
        return new Promise<AdminCourseDescription[]>((resolve, reject) => {

        });
    }

    async loadUserEnrolledCourses (userId: string): Promise<EnrolledCourseDescription[]> {
        this.logger.log('info', 'Retrieving courses for user: %s', userId);

        return new Promise<EnrolledCourseDescription[]>((resolve, reject) => {
            if (!userId) {
                reject(`No user id provided to load courses`);
            }

            (async () => {
                try {
                    let result = await datasource.query({
                        // language=PostgreSQL
                        text: `
                          SELECT id, title FROM tu.course c JOIN
                            (SELECT unnest(
                                     u.admin_of_course_ids) AS admin_course_id FROM
                               tu.user u WHERE u.id = $1) u
                              ON c.id = u.admin_course_id
                        `,
                        values: [userId]
                    });

                    let enrolled:EnrolledCourseDescription[] = result.rows.map((row) => {
                        return {
                            id: row.id,
                            title: row.title
                        }
                    });

                    resolve(enrolled);
                } catch (e) {
                    reject(e);
                }
            })();


        });
    }

    async courseExists (courseData: CourseData): Promise<boolean> {
        console.log('checking course exists from courses repository');
        return new Promise<boolean>((resolve, reject) => {
            if (!courseData.title) {
                return resolve(false);
            }

            (async () => {
                try {
                    let result = await datasource.query({
                        text: `SELECT COUNT(*) FROM tu.course WHERE title = $1`,
                        values: [courseData.title]
                    });
                    resolve(result.rows[0].count !== '0');
                } catch (e) {
                    reject(e);
                }
            })();
        });
    }

    async createCourse (courseData: CourseData): Promise<string> {
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

    async loadUserEnrolledCourse (courseId: string): Promise<UserEnrolledCourseData> {
        return new Promise<UserEnrolledCourseData>((resolve, reject) => {
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

    async loadUserAdminCourse (courseId: string): Promise<UserAdminCourseData> {
        return new Promise<UserAdminCourseData>((resolve, reject) => {

        });
    }
}

export const coursesRepository = new CoursesRepository(datasource);
