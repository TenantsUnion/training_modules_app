import Vue, {ComponentOptions, VueConstructor} from 'vue';
import * as _ from "underscore";

export const refsVueMixin = () => {
    Vue.mixin({
        methods: {
            normalizeRefs(refs: any): any {
                if (_.isArray(refs)) {
                    return refs;
                } else if (_.isObject(this.$refs.optionRefs)) {
                    return [refs];
                } else {
                    return [];
                }

            }
        }
    });
};
