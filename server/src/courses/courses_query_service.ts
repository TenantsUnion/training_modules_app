import * as _ from "underscore";
import {Datasource} from '../datasource';
import {slugToId, slugToTitle, titleToSlug} from '../../../shared/slug/title_slug_transformations';

/**
 * Service for finding out information about courses
 */
export class CoursesQueryService {
    constructor(private datasource: Datasource) {
    }

    /**
     * Finds the course id embedded in the slug or the title and user id to look up the course id
     * @param {string} slug version of the title
     * @param {string} userId corresponds to user related to slug (id will be embedded if user has duplicate titles)
     * @returns {Promise<string>}
     */
    async courseIdFromSlug(slug: string, userId: string): Promise<string> {
        let title = slugToTitle(slug);
        let courseId = slugToId(slug);
        return courseId ? courseId : await this.findCourseId(title, userId);
    }

    async courseSlug(userId: string, courseTitle: string, courseId: string, isAdmin: boolean): Promise<string> {
        let isDuplicate = await this.isDuplicateCoursesTitle(userId, courseTitle, isAdmin);
        return titleToSlug(courseTitle, isDuplicate, courseId);
    }

    /**
     * Queries the database to see if the user is enrolled in or the admin of multiple courses with the same title
     * @param {string} userId - the user to query for
     * @param {string} courseTitle - the title check for duplicates of
     * @param {boolean} isAdmin - whether to check the courses the user is admin of or enrolled in
     *
     * @returns {Promise<boolean>} async boolean indicating if the course title has duplicates
     */
    async isDuplicateCoursesTitle(userId: string, courseTitle: string, isAdmin: boolean): Promise<boolean> {
        let courseColumn = isAdmin ? 'admin_of_course_ids' : 'enrolled_in_course_ids';

        let results = await this.datasource.query({
            text: `
                SELECT COUNT(*) FROM tu.course c
                    INNER JOIN (SELECT * FROM tu.user u WHERE u.id = $1) u
                    ON c.id = ANY (u.${courseColumn})
                WHERE c.title = $2;
             `,
            values: [userId, courseTitle]
        });

        return parseInt(results[0].count) > 1;
    }

    /**
     * Precondition that the provided course title is unique for that user's courses. Otherwise the course id is needed
     */
    async findCourseId(courseTitle: string, userId: string): Promise<string> {


        let results = await this.datasource.query({
            text: `
                SELECT c.id FROM tu.course c
                    INNER JOIN (SELECT * FROM tu.user u WHERE u.id = $1) u
                        ON c.id = ANY (u.admin_of_course_ids)
                WHERE lower(c.title) = lower($2) ORDER BY c.id ASC;
            `,
            values: [userId, courseTitle]
        });


        if (results.length !== 1) {
            throw new Error(`Cannot derive course id from userId: ${userId}, title: ${courseTitle}. Query results: ${JSON.stringify(results)}`);
        }
        return results[0].id;
    }

    async courseExists(courseTitle): Promise<boolean> {
        let result = await this.datasource.query({
            text: `SELECT COUNT(*) FROM tu.course WHERE title = $1`,
            values: [courseTitle]
        });
        return result[0].count !== '0';
    }
}

