import nodeSql from 'sql';
import {Sql} from 'sql';

declare module "sql" {
    interface Sql {
        select<U>(expr: string): Query<U>;
    }

}

export const sqlBuilder: () => Sql = () => new (<any> nodeSql).Sql();
