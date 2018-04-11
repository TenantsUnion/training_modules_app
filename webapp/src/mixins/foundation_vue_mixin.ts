import {ComponentOptions} from 'vue';
import {Vue} from 'vue/types/vue';

// load javascript functionality for foundation
let foundationModule = require('foundation-sites').default;

export const FoundationMixin: ComponentOptions<Vue> = {
    mounted(this: Vue) {
        this.Foundation = foundationModule;
    },
    destroyed(this: Vue) {
        // (<any>this.$(this.$el)).foundation('destroy');
    }
};
