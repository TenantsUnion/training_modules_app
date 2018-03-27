import sql from 'sql';
import {BinaryNode, Column, Columns, OrderByValueNode, Query, QueryLike, SQL, Table} from "sql";
import {Datasource} from "@server/datasource";

export enum SqlOp {
    EQUALS = '=',
    NOT_EQUAL = '<>',
    GREATER = '>',
    LESS = '<',
    GREATER_OR_EQUAL = '>=',
    LESS_OR_EQUAL = '<=',
    BETWEEN = 'BETWEEN',
    LIKE = 'LIKE',
    IN = 'IN'
}

export type PredicateObj = { op: SqlOp, val: any };
export type SearchParams<Id, Row> = {
    predicates?: {
        [index in keyof Row]?: PredicateObj
        },
    id?: Id
    orderBy?: { colName: keyof Row, dir: 'asc' | 'desc' }[]
};
export type IdType<Row> = {[index in keyof Row]?: Row[index]};
const applySqlOp: {[index in SqlOp]?: <Name>(col: Column<Name, any>, val, t: Columns<any>) => BinaryNode} = {
    [SqlOp.EQUALS]: (col, val, t) => col.equals(val),
    [SqlOp.NOT_EQUAL]: (col, val, t) => col.notEquals(val),
    [SqlOp.GREATER]: (col, val, t) => col.gt(val),
    [SqlOp.LESS]: (col, val, t) => col.lt(val),
    [SqlOp.GREATER_OR_EQUAL]: (col, val, t) => col.gte(val),
    [SqlOp.LESS_OR_EQUAL]: (col, val, t) => col.lte(val),
    [SqlOp.BETWEEN]: (col, val, t) => col.gte(val[0]).and(col.lte(val[0])),
    [SqlOp.LIKE]: (col, val, t) => {
        // if val is all lower  make predicate case insensitive
        return val.toLowerCase() === val ? (<any>sql).functions.LOWER(col).like(val) : col.like(val);
    },
    [SqlOp.IN]: (col, val, t) => col.in(val)
};

export abstract class AbstractViewQuery<Id, View, Row> {

    protected abstract id (id: Id): BinaryNode;

    protected abstract paramSelect (): Query<Row>;

    protected abstract get columns (): Columns<Row>;

    constructor (protected datasource: Datasource) {
    }

    async searchView ({id, predicates, orderBy}: SearchParams<Id, Row>): Promise<View> {
        const select = id ? this.paramSelect().where(this.id(id)) : this.paramSelect();
        const query = predicates ? select.where(this.processPredicates(predicates)) : select;
        const ordered = orderBy ? query.order(this.processOrderBy(orderBy)) : query;
        const results = await this.datasource.query(this.postProcessQuery(ordered));
        return this.processView(results);
    }

    protected processPredicates (searchPredicates: SearchParams<Id, Row>["predicates"]): BinaryNode {
        return Object.keys(searchPredicates)
            .map(<CName extends keyof Row> (colName: CName) => {
                let {op, val} = searchPredicates[colName];
                let col: Column<CName, Row[CName]> = this.columns[<string>colName];
                return applySqlOp[op](col, val, this.columns);
            })
            .reduce((combinedPredicate, colPredicate) => combinedPredicate.and(colPredicate));
    }

    protected processOrderBy (searchOrderBy: SearchParams<Id, Row>["orderBy"]): OrderByValueNode[] {
        // cast to <any> due to open github issue with indexing twice with generics
        // https://github.com/Microsoft/TypeScript/issues/21760
        return searchOrderBy.map(({colName, dir}) => (<any>this.columns)[colName][dir])
    }

    protected postProcessQuery (query: Query<Row>): QueryLike {
        // noop for super class but subclasses can override to use group by together with overriding baseSelect
        // for json processing
        return query.toQuery();
    }

    protected processView (view: any) {
        return view;
    }

}