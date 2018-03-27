import {Datasource} from "../../datasource";
import {TrainingProgressRepository} from "./training_progress_repository";


export interface CourseStructure {
    id: string;
    orderedModuleIds: string[];
    modules: {
        id: string,
        orderedSectionIds: string[]
    }[]

}

export class CourseProgressRepository extends TrainingProgressRepository {
    constructor (sqlTemplate: Datasource) {
        super(sqlTemplate);
    }

    get tableNames () {
        return {
            progress: 'course_progress',
            training: 'course'
        }
    }

    async courseStructure (courseId: string): Promise<CourseStructure> {
        let result = await this.sqlTemplate.query({
            // language=PostgreSQL
            text: `
              SELECT c.id, c.ordered_module_ids, json_agg(m.*) AS modules FROM tu.course c
                LEFT JOIN LATERAL
                          (SELECT m.id, m.ordered_section_ids, json_agg(s.*) AS sections FROM tu.module m
                  LEFT JOIN LATERAL
                            (SELECT s.id FROM tu.section s WHERE s.id = ANY (m.ordered_section_ids)) s ON TRUE WHERE
                  m.id = ANY (c.ordered_module_ids) GROUP BY m.id) m ON TRUE
              WHERE c.id = $1 GROUP BY c.id;
            `,
            values: [courseId]
        });
        return result[0];
    }
}