import {CourseEnrolledView, EnrolledUserView} from "@shared/course_progress_summary";
import {sqlBuilder} from "@server/views/sql";
import {Query} from "sql";
import {CourseProgressRow, courseProgressTable, getColumns, userTable} from "@server/views/table_definitions";
import {AbstractCourseViewQuery} from "@server/views/course/abstract_course_view_query";

type CourseEnrolledUserRow = CourseProgressRow & { username: string };


/**
 * Listing of an enrolled users progress in a course
 */
export class CourseEnrolledUserViewQuery
    extends AbstractCourseViewQuery<EnrolledUserView[], CourseEnrolledUserRow> {

    protected paramSelect (): Query<CourseEnrolledUserRow> {
        return sqlBuilder().select(`
          cp.*, m.modules, u.username FROM
            tu.course_progress cp
            INNER JOIN tu.course c ON c.id = cp.id
            LEFT JOIN tu.user u ON cp.user_id = u.id
            LEFT JOIN LATERAL
                      (
                      SELECT coalesce(json_agg(m.*), '[]') AS modules FROM
                        (
                          SELECT mp.*, s.sections FROM tu.module m
                            INNER JOIN tu.module_progress mp ON m.id = mp.id
                            INNER JOIN LATERAL
                                       (
                                       SELECT coalesce(json_agg(s.*), '[]') AS sections FROM
                                         (
                                           SELECT sp.* FROM tu.section s
                                             INNER JOIN tu.section_progress sp
                                               ON s.id = sp.id WHERE
                                             s.id = ANY (m.ordered_section_ids)
                                         ) s
                                       ) s ON TRUE
                          WHERE m.id = ANY (c.ordered_module_ids)
                        ) m
                      ) m ON TRUE
        `);
    }

    protected get columns () {
        return {
            ...getColumns(courseProgressTable),
            username: getColumns(userTable).username
        };
    }
}