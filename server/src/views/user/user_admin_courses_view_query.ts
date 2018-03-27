import {CourseDescription} from "@shared/courses";
import {AbstractUserViewQuery} from "./abstract_user_view_query";
import {CourseRow, courseTable, getColumns, UserRow, userTable} from "../table_definitions";
import {Query} from "sql";
import {sqlBuilder} from "@server/views/sql";



export class UserAdminCoursesViewQuery extends AbstractUserViewQuery<CourseDescription[], (CourseRow & UserRow)> {
    protected get columns () {
        return {
            ...getColumns(courseTable),
            ...getColumns(userTable), // user table last to have id column
        };
    }

    paramSelect (): Query<CourseRow & UserRow> {
        return sqlBuilder().select(`
          c.id, c.title, c.description, c.time_estimate, c.last_modified_at, c.created_at
          FROM tu.course c INNER JOIN tu.user u
              ON c.id = ANY (u.admin_of_course_ids)
        `);
    }
}