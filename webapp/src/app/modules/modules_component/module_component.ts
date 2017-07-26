import * as Vue from "vue";
import Component from "vue-class-component";

require('./module_component.scss');

@Component({
    template: require('./module_component.tpl.html')
})
export class ModuleComponent extends Vue {
}