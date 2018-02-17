import {AbstractRepository, getUTCNow} from "../../repository";
import {Datasource} from "../../datasource";
import {CourseProgressId} from "@shared/user_progress";


export interface CourseStructure {
    id: string;
    orderedModuleIds: string[];
    modules: {
        id: string,
        orderedSectionIds: string[]
    }[]

}

export class CourseProgressRepository extends AbstractRepository {
    constructor (sqlTemplate: Datasource) {
        super('', sqlTemplate);
    }

    async createCourseProgress ({courseId, userId}: CourseProgressId) {
        let time = getUTCNow();
        await this.sqlTemplate.query({
            text: `
              INSERT INTO tu.course_progress (user_id, course_id, last_view_at, last_modified_at, created_at)
                VALUES  ($1, $2, $3, $3, $3)`,
            values: [courseId, userId, time]
        });
    }

    async courseStructure (courseId: string): Promise<CourseStructure> {
        let result = await this.sqlTemplate.query({
            // language=PostgreSQL
            text: `
              SELECT c.id, c.ordered_module_ids, json_agg(m.*) AS modules FROM tu.course c
                INNER JOIN LATERAL
                           (SELECT m.id, m.ordered_section_ids, json_agg(s.*) AS sections FROM tu.module m
                  INNER JOIN LATERAL
                             (SELECT s.id FROM tu.section s WHERE s.id = ANY (m.ordered_section_ids)) s ON TRUE WHERE
                  m.id = ANY (c.ordered_module_ids)) m ON TRUE
              WHERE c.id = $1
            `,
            values: [courseId]
        });
        return result[0];
    }

    async loadCourseProgress ({courseId, userId}: CourseProgressId) {
        let results = await this.sqlTemplate.query({
            text: `
            SELECT * FROM tu.course_progress cp WHERE cp.course_id = $1 AND cp.user_id = $2; 
            `,
            values: [courseId, userId]
        });
        return results[0];
    }
}