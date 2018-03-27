import {store} from "@store/store";
import {ComponentOptions, VueConstructor} from "vue";
import Vue from "vue";

export const storeMixin = () => {
    Vue.mixin(<ComponentOptions<Vue> & VueConstructor> {
        beforeCreate: function() {
            this.$state = store.state;
            this.$getters = store.getters;
        }
    });
};
