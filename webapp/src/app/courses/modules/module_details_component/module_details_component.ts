import Vue from 'vue';
import Component from "vue-class-component";
import {ModuleData, ModuleDetails} from '../../../../../../shared/modules';
import {coursesService} from '../../courses_service';
import {COURSES_ROUTE_NAMES, coursesRoutesService} from '../../courses_routes';

@Component({
    data: () => {
        return {
            module: null,
            isCourseAdmin: false
        };
    },
    template: require('./module_details_component.tpl.html')
})

export class ModuleDetailsComponent extends Vue {
    moduleUnsubscribe: () => any;
    loading: boolean;
    isCourseAdmin: boolean;
    module: ModuleData;

    created() {
        this.loading = true;
        this.isCourseAdmin = coursesRoutesService.isCourseAdmin();
        this.moduleUnsubscribe = coursesService.subscribeCurrentModule((module) => {
            this.loading = false;
            this.module = module;
        });
    }

    createSection(){
        this.$router.push({name: COURSES_ROUTE_NAMES.createSection});
    }

    destroyed() {
        this.moduleUnsubscribe();
    }
}