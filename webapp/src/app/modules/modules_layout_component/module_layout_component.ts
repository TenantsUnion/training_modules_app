import * as Vue from "vue";
import Component from "vue-class-component";

require('./module_layout_component.scss');

@Component({
    template: require('./module_layout_component.tpl.html')
})
export class ModuleLayoutComponent extends Vue {
}