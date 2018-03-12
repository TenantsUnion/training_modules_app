import {Datasource} from "../../datasource";
import {ViewCourseStructure} from "@shared/courses";
import {orderObjByIds, toIdObjMap} from "@util/id_entity";


export class CourseStructureViewQuery {
    constructor (protected datasource: Datasource) {
    }


    async loadCourseStructure (courseId: string): Promise<ViewCourseStructure> {
        let result = await this.datasource.query({
            // language=PostgreSQL
            text: `
              SELECT c.id, c.version, c.active, c.title, c.description, c.last_modified_at, c.created_at,
                c.ordered_module_ids, c.ordered_content_ids, c.ordered_question_ids, c.time_estimate,
                json_agg(m.*) AS modules
              FROM tu.course c
                LEFT JOIN LATERAL
                          (SELECT m.id, m.version, m.active, m.title, m.description, m.last_modified_at, m.created_at,
                             m.ordered_section_ids, m.ordered_content_ids, m.ordered_question_ids, m.time_estimate,
                             json_agg(s.*) AS sections
                           FROM tu.module m
                             LEFT JOIN LATERAL
                                       (SELECT s.id, s.version, s.active, s.title, s.description, s.last_modified_at,
                                          s.created_at, s.time_estimate, s.ordered_content_ids, s.ordered_question_ids
                                        FROM tu.section s) s ON s.id = ANY (m.ordered_section_ids)
                           GROUP BY m.id) m ON m.id = ANY (c.ordered_module_ids)
              WHERE c.id = $1 GROUP BY c.id;
            `,
            values: [courseId]
        });
        let {orderedModuleIds, orderedContentIds, orderedQuestionIds, modules, ...courseProps} = result[0];
        // empty query passed to json_agg() return [ null ]
        return {
            ...courseProps,
            content: orderedContentIds.length,
            questions: orderedQuestionIds.length,
            modules: modules[0] !== null ? orderObjByIds(orderedModuleIds, toIdObjMap(modules)).map((module) => {
                let {orderedSectionIds, orderedContentIds, orderedQuestionIds, sections, ...moduleProps} = module;
                return {
                    ...moduleProps,
                    content: orderedContentIds.length,
                    questions: orderedQuestionIds.length,
                    sections: sections[0] !== null ? orderObjByIds(orderedSectionIds, toIdObjMap(sections))
                        .map((section) => {
                            let {orderedContentIds, orderedQuestionIds, ...sectionProps} = section;
                            return {
                                ...sectionProps,
                                content: orderedContentIds.length,
                                questions: orderedQuestionIds.length
                            };
                        }) : []
                };
            }) : []
        };
    }
}
