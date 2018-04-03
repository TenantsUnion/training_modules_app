import Vue from 'vue';
import Component from 'vue-class-component';
import {SearchField} from '@components/search_table/search_table_component';
import {Predicate} from '@shared/views';
import {camelToSnakeCase} from '@shared/util/camel_to_snake_case_util';

@Component({
    props: {
        searchField: {
            required: true,
            type: Object
        },
        triggerSearch: {
            required: true,
            type: Function
        }
    }
})
export class SearchFieldComponent extends Vue {
    searchField: SearchField;
    filterInput: any = '';

    get predicate(): Predicate {
        return this.filterInput ? {
            op: this.searchField.op,
            colNames: this.searchField.columnNames.map((colName) => camelToSnakeCase(colName)),
            val: this.filterInput
        } : null;
    }
}

export default SearchFieldComponent;
