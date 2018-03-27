import {AbstractViewQuery} from "../abstract_view_query";
import {BinaryNode} from "sql";
import {getColumns, userTable} from "@server/views/table_definitions";

export abstract class AbstractUserViewQuery<View, Row>
    extends AbstractViewQuery<string, View, Row> {

    protected id (id: string): BinaryNode {
        return getColumns(userTable).id.equals(id);
    }
}