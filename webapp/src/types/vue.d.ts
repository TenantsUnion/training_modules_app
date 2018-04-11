/** Extends interfaces in Vue.js and Vuex **/
import {Store} from "vuex";
import {RootGetters, RootState} from "@store/store_types";
import FoundationSitesStatic from 'foundation';

declare module "vue/types/vue" {


    interface Vue {
        $getters: RootGetters
        $state: RootState
        $: JQueryStatic
        normalizeRefs: <R extends object = object>(any: (R | R[] | any)) => R[];
        Foundation: FoundationSitesStatic
    }

    interface VueConstructor<V extends Vue = Vue> {
        $getters: RootGetters,
        $state: RootState,
        $store: Store<RootState>
        $: JQueryStatic
        normalizeRefs: <R extends object = object>(any: (R | R[])) => R[];
    }
}
