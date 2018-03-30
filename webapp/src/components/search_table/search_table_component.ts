import Vue from "vue";
import Vuetable, {CssConfig, Field, HttpFetchFn, TransformFn} from "vuetable-2";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";

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
        Vuetable
    }
})
export class TableConfigComponent extends Vue {
    @Prop({type: Function, required: true})
    fetch: HttpFetchFn;
    @Prop({type: Function, required: true})
    transform: TransformFn<any>;
    @Prop({type: Array, required: true})
    fields: Field[];
    @Prop({type: Array, required: false, default: []})
    searchFields:
}

export default TableConfigComponent;