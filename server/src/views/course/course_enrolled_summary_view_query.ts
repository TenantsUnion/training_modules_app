import {CourseEnrolledSummaryView} from "@shared/course_progress_summary";
import {Columns, Query, QueryLike} from "sql";
import {AbstractViewQuery} from "@server/views/abstract_view_query";
import {sqlBuilder} from "@server/views/sql";
import {courseProgressTable} from "@server/views/table_definitions";

type CourseEnrolledSummaryRow = {
    id: string,
    total_enrolled: number,
    total_completed: number
};

/**
 * Consists of aggregate details of the enrolled users of a course like the total number enrolled or the number
 * completed
 */
export class CourseEnrolledSummaryViewQuery
    extends AbstractViewQuery<string, CourseEnrolledSummaryView, CourseEnrolledSummaryRow> {

    protected paramSelect (): Query<CourseEnrolledSummaryRow> {
        return sqlBuilder().select(`
          cp.id, COUNT(*) :: INT AS total_enrolled,
            coalesce(SUM(CASE WHEN cp.course_completed IS NOT NULL THEN 1 ELSE 0 END), 0) :: INT AS total_completed
          FROM tu.course_progress cp
        `);
    }

    protected get columns () {
        return <Columns<CourseEnrolledSummaryRow>> {
            id: courseProgressTable.id,
            // these two columns probably don't work...
            total_enrolled: courseProgressTable.id.count().as('total_enrolled'),
            total_completed: courseProgressTable.course_completed.sum().as('total_completed')
        };
    }


    protected postProcessQuery (query: Query<CourseEnrolledSummaryRow>): QueryLike {
        return query.group(this.columns.id).toQuery();
    }


    protected processView (view: any): any {
        return view[0];
    }

    id(id: string) {
        return courseProgressTable.id.equals(id);
    }

}