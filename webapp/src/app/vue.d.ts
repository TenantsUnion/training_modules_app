/** Extends interfaces in Vue.js and Vuex **/
import {RootGetters} from "@webapp_root/store";
import {RootState} from "@webapp_root/store";
import {Store} from "vuex";

declare module "vue/types/vue" {

    interface Vue {
        $getters: RootGetters
        $state: RootState
    }

    interface VueConstructor<V extends Vue = Vue> {
        $getters: RootGetters,
        $state: RootState,
        $store: Store<RootState>
    }
}
