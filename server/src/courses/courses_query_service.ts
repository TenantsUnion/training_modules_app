/**
 * Service for finding out information about courses
 */
import {Datasource} from '../datasource';

export class CoursesQueryService {
    constructor(private datasource: Datasource) {
    }

    async courseIdFromSlug(slug: string, userId: string): Promise<string> {
        let courseInfo = courseTitleIdFromSlug(slug);
        return courseInfo.id ? courseInfo.id : await this.findCourseId(courseInfo.title, userId);
    }

    async courseSlug(userId: string, courseTitle: string, courseId: string, isAdmin: boolean) {
        let isUnique = await this.isUniqueCourseTitleForUser(userId, courseTitle, isAdmin);
        return courseSlug(courseTitle, isUnique, courseId);
    }

    async isUniqueCourseTitleForUser(userId: string, courseTitle: string, isAdmin: boolean): Promise<boolean> {
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

        return parseInt(results[0].count) < 2;
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

const courseIdSlugMarker = '__';

export const courseSlug = (courseTitle: string, isUnique: boolean, courseId: string): string => {
    let title = isUnique ? courseTitle : `${courseTitle + courseIdSlugMarker + courseId}`;
    return title.replace(/\s+/g, '-').toLowerCase();
};

/**
 * Converts the slug (string intended for path url) into the course title it was derived from by converting spaces into '-' and stripping away the
 * number course id that is needed to uniquely identify course titles that are the same
 */
export const courseTitleIdFromSlug = (slug: string): { id: string | null, title: string } => {
    let isCompoundId = slug.indexOf(courseIdSlugMarker);
    return {
        id: isCompoundId !== -1 ? slug.split(courseIdSlugMarker)[1] : null,
        title: isCompoundId !== -1 ? slug.split(courseIdSlugMarker)[0] : slug
    };
};
