import Vue from 'vue';
import Component from "vue-class-component";
import {ModuleData, ModuleDetails} from '../../../../../../shared/modules';
import {coursesService} from '../../courses_service';

@Component({
    data: () => {
        return {
            module: null
        };
    },
    template: require('./module_details_component.tpl.html')
})

export class ModuleDetailsComponent extends Vue {
    moduleUnsubscribe: () => any;
    loading: boolean;
    module: ModuleData;

    created() {
        this.loading = true;
        this.moduleUnsubscribe = coursesService.subscribeCurrentModule((module) => {
            this.loading = false;
            this.module = module;
        });
    }

    destroyed() {
        this.moduleUnsubscribe();
    }
}