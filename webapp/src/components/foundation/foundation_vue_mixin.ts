import Vue from 'vue';
import Component from 'vue-class-component';

// load javascript functionality for foundation
let foundationModule = require('foundation-sites').default;

@Component
export class FoundationMixin extends Vue {
    mounted(this: Vue) {
        this.Foundation = foundationModule;
    }
    destroyed(this: Vue) {
        // (<any>this.$(this.$el)).foundation('destroy');
    }
};
