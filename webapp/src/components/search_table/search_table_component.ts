import _ from "underscore";
import {OrderByCol, SqlOp, Predicate} from "@shared/views";
import Vue from "vue";
import Vuetable, {CssConfig, Field, HttpOptions, PaginationOptions, TransformFn} from "vuetable-2";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import SearchFieldComponentVue from '@components/search_table/search_field/search_field_component.vue';
import SearchFieldComponent from '@components/search_table/search_field/search_field_component';
import {camelToSnakeCase} from '@shared/util/camel_to_snake_case_util';

export interface SearchField {
    columnNames: string[]; // these will get OR'd together
    op: SqlOp
    type: 'text' | 'number' | 'date' | 'boolean',
    placeholderText: string,
    name: string
}

export type FetchTableDataFn<Row = any, Data = any> = (predicates: Predicate<Row>[], orderBy: OrderByCol<Row>[],
                                                       pagination: PaginationOptions, httpOptions: HttpOptions) =>
    Promise<{ data: Data }>;

export interface FetchTableData {
    fetchTableData: FetchTableDataFn
}

/**
 *  Defaults taken from vuetable component css property defaults with font awesome icons used instead of
 *  Semantic
 */
const DEFAULT_CSS_CONFIG: CssConfig = {
    tableClass: 'ui blue selectable celled stackable attached table',
    loadingClass: 'loading',
    ascendingIcon: 'blue fa fa-chevron-up icon',
    descendingIcon: 'blue fa fa-chevron-down icon',
    ascendingClass: 'sorted-asc',
    descendingClass: 'sorted-desc',
    sortableIcon: '',
    detailRowClass: 'vuetable-detail-row',
    handleIcon: 'grey sidebar icon',
    tableBodyClass: 'vuetable-semantic-no-top vuetable-fixed-layout',
    tableHeaderClass: 'vuetable-fixed-layout'
};

@Component({
    data: () => {
        return {
            cssConfig: DEFAULT_CSS_CONFIG
        }
    },
    components: {
        Vuetable,
        'search-field': SearchFieldComponentVue
    }
})
export class SearchTableComponent extends Vue {
    @Prop({type: Function, required: true})
    fetchData: FetchTableDataFn;
    @Prop({type: Function, required: true})
    transform: TransformFn<any>;
    @Prop({type: Array, required: true})
    fields: Field[];
    @Prop({type: Array, required: false, default: () => []})
    sortOrder: Field[];
    @Prop({type: Array, required: false, default: () => []})
    searchFields: SearchField[];

    get triggerSearch() {
        return _.debounce(() => {
            (<any> this.$refs.vuetable).loadData();
        }, 300);
    }

    async fetchHttp(apiUrl: string, httpOptions: HttpOptions): Promise<{ data: any[] }> {
        let {params: {page, per_page, sort}} = httpOptions;
        let predicates: Predicate[] = this.normalizeRefs<SearchFieldComponent>(this.$refs.searchFields)
            .map((field) => field.predicate)
            .filter((predicate) => predicate);

        let orderBy = this.orderBy(sort);

        return this.fetchData(predicates, orderBy, {page, per_page}, httpOptions);
    }

    /**
     * Vuetable order string is of the form "{colName}|{direction},{colName}|{direction}..."
     * @param {string} orderStr
     * @returns {{}}
     */
    private orderBy(orderStr: string): OrderByCol[] {
        return orderStr ?
            orderStr.split(",").map((colDirStr) => {
                let colOrder = colDirStr.split("|");
                return {
                    colName: camelToSnakeCase(colOrder[0]),
                    dir: <"desc"|"asc"> colOrder[1]
                };
            })
            : [];
    }
}

export default SearchTableComponent;