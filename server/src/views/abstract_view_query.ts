import {ViewSearchParams, SqlOp, Predicate} from "@shared/views";
import sql from 'sql';
import {BinaryNode, Column, Columns, OrderByValueNode, Query, QueryLike} from "sql";
import {Datasource} from "@server/datasource";


/**
 * Map of {@link SqlOp} to corresponding {@link Column} predicate of node-sql library
 * {@link
    */
const applySqlOp: {[index in SqlOp]?: <Name>(col: Column<Name, any>, val, t: Columns<any>) => BinaryNode} = {
    [SqlOp.EQUALS]: (col, val, t) => col.equals(val),
    [SqlOp.NOT_EQUAL]: (col, val, t) => col.notEquals(val),
    [SqlOp.GREATER]: (col, val, t) => col.gt(val),
    [SqlOp.LESS]: (col, val, t) => col.lt(val),
    [SqlOp.GREATER_OR_EQUAL]: (col, val, t) => col.gte(val),
    [SqlOp.LESS_OR_EQUAL]: (col, val, t) => col.lte(val),
    [SqlOp.BETWEEN]: (col, val, t) => col.gte(val[0]).and(col.lte(val[0])),
    [SqlOp.LIKE]: (col, val, t) => {
        let escapedVal = val.replace(/[%_]/i, (val) => '\\' + val);
        let likeVal = ['%', escapedVal, '%'].join('');
        // if val is all lower  make predicate case insensitive
        return likeVal.toLowerCase() === likeVal ? (<any>sql).functions.LOWER(col).like(likeVal) : col.like(likeVal);
    },
    [SqlOp.IN]: (col, val, t) => col.in(val)
};

export abstract class AbstractViewQuery<Id, View, Row> {

    /**
     * @param {Id} id
     * @returns {BinaryNode} Predicate that filters for rows whose 'id' column equals the provided id
     */
    protected abstract id(id: Id): BinaryNode;

    protected abstract paramSelect(): Query<Row>;

    protected abstract get columns(): Columns<Row>;

    constructor(protected datasource: Datasource) {
    }

    async searchView(searchParams: ViewSearchParams<Id, Row>): Promise<View> {
        let {id, predicates, orderBy} = searchParams;
        const select = id ? this.paramSelect().where(this.id(id)) : this.paramSelect();
        const query = predicates && predicates.length ?
            select.where(this.processPredicates(predicates)) : select;
        const ordered = orderBy && orderBy.length ?
            query.order(this.processOrderBy(orderBy)) : query;
        const results = await this.datasource.query(this.postProcessQuery(ordered));
        return this.processView(results);
    }

    protected processPredicates(searchPredicates: ViewSearchParams<Id, Row>["predicates"]): BinaryNode {
        return searchPredicates
            .map((predicate: Predicate<Row>) => {
                let {op, val, colNames} = predicate;
                return colNames
                    .map((col) => this.columns[col])
                    .map((col) => applySqlOp[op](col, val, this.columns))
                    .reduce((colORed, col) => {
                        return colORed.or(col);
                    });
            })
            .reduce((combinedPredicate, colPredicate) => combinedPredicate.and(colPredicate));
    }

    protected processOrderBy(searchOrderBy: ViewSearchParams<Id, Row>["orderBy"]): OrderByValueNode[] {
        // cast to <any> due to open github issue with indexing twice with generics
        // https://github.com/Microsoft/TypeScript/issues/21760
        return searchOrderBy.map(({colName, dir}) => (<any>this.columns)[colName][dir])
    }

    protected postProcessQuery(query: Query<Row>): QueryLike {
        // noop for super class but subclasses can override to use group by together with overriding baseSelect
        // for json processing
        return query.toQuery();
    }

    protected processView(view: any) {
        return view;
    }

}