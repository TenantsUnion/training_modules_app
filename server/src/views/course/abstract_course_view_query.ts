import {AbstractViewQuery} from "../abstract_view_query";
import {courseTable, getColumns} from "@server/views/table_definitions";

export abstract class AbstractCourseViewQuery<View, Row>
    extends AbstractViewQuery<string, View, Row> {

    protected id (id: string) {
        return getColumns(courseTable).id.equals(id);
    }
}
