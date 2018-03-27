/** Extends interfaces in Vue.js and Vuex **/
import {RootGetters} from "@store/store_types";
import {RootState} from "@store/store_types";
import {Store} from "vuex";

declare module "vue/types/vue" {


    interface Vue {
        $getters: RootGetters
        $state: RootState
        $: JQueryStatic
    }

    interface VueConstructor<V extends Vue = Vue> {
        $getters: RootGetters,
        $state: RootState,
        $store: Store<RootState>
        $: JQueryStatic
    }
}
