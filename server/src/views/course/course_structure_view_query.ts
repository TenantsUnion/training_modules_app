import {AbstractCourseViewQuery} from "./abstract_course_view_query";
import {ViewCourseStructure} from "@shared/courses";
import {orderObjByIds, toIdObjMap} from "@shared/util/id_array_util";
import {CourseRow, courseTable} from "@server/views/table_definitions";
import {sqlBuilder} from "@server/views/sql";
import {Query, QueryLike, Table} from "sql";


export class CourseStructureViewQuery extends AbstractCourseViewQuery<ViewCourseStructure, CourseRow> {
    paramSelect (): Query<CourseRow> {
        return sqlBuilder().select(`
          c.id, c.version, c.active, c.title, c.description, c.last_modified_at, c.created_at,
            c.ordered_module_ids, c.ordered_content_ids, c.ordered_question_ids, c.time_estimate,
            json_agg(m.*) AS modules
          FROM tu.course c
            LEFT JOIN
            (SELECT m.id, m.version, m.active, m.title, m.description, m.last_modified_at, m.created_at,
               m.ordered_section_ids, m.ordered_content_ids, m.ordered_question_ids, m.time_estimate,
               json_agg(s.*) AS sections
             FROM tu.module m
               LEFT JOIN
               (SELECT s.id, s.version, s.active, s.title, s.description, s.last_modified_at, s.created_at,
                  s.time_estimate, s.ordered_content_ids, s.ordered_question_ids
                FROM tu.section s) s ON s.id = ANY (m.ordered_section_ids)
             GROUP BY m.id) m ON m.id = ANY (c.ordered_module_ids)`
        );
    }

    protected postProcessQuery (query: Query<CourseRow>): QueryLike {
        return query
            .group(courseTable.id)
            .toQuery();
    }

    get columns (): Table<'c', CourseRow> {
        return courseTable;
    }

    protected processView ([view]): ViewCourseStructure {
        let {orderedModuleIds, modules, orderedContentIds, orderedQuestionIds, ...props} = <any>view;
        return <ViewCourseStructure>{
            ...props,
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
        }
    }
}
